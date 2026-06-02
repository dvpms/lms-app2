import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { calculateLevel } from '@/lib/pointService'
import { buildQuizReviewDetails, calculateQuizScore } from '@/lib/quizGrading'

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { answers, questionIds } = body

    const { id: quizId } = await params
    const userId = session.user.id

    // Fetch only the questions that were shown in this session
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          where: questionIds?.length ? { id: { in: questionIds } } : undefined,
          include: { options: true },
        },
      },
    })
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz tidak ditemukan' }, { status: 404 })
    }

    const score = calculateQuizScore(quiz.questions, answers)
    const details = buildQuizReviewDetails(quiz.questions, answers)
    const correctCount = details.filter((detail) => detail.isCorrect).length

    // Always create a new submission — retakes are allowed
    const submission = await prisma.submission.create({
      data: { userId, quizId, score },
    })

    // Award points for every submission — no idempotency for quiz retakes
    await prisma.activityLog.create({
      data: { userId, type: 'QUIZ', activityId: quizId, points: score },
    })

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { points: { increment: score } },
    })

    const newLevel = calculateLevel(updatedUser.points)
    if (newLevel !== updatedUser.level) {
      await prisma.user.update({ where: { id: userId }, data: { level: newLevel } })
      updatedUser.level = newLevel
    }

    return NextResponse.json({
      data: {
        submission,
        score,
        correctCount,
        totalQuestions: quiz.questions.length,
        details,
        points: updatedUser.points,
        level: updatedUser.level,
        firstAttempt: true,
      },
    })
  } catch (error) {
    console.error('[submit] ERROR:', error)
    return NextResponse.json({ error: 'Gagal submit quiz' }, { status: 500 })
  }
}
