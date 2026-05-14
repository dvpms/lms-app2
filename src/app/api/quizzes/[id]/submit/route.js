import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { postActivityService } from '@/lib/pointService'

function calculateScore(questions, answers) {
  return questions.reduce((total, question) => {
    const selectedOptionId = answers[question.id]
    const correctOption = question.options.find((o) => o.isCorrect)
    if (correctOption && correctOption.id === selectedOptionId) {
      return total + question.points
    }
    return total
  }, 0)
}

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const quizId = params.id

    const existing = await prisma.submission.findFirst({ where: { userId, quizId } })
    if (existing) {
      return NextResponse.json({ data: { submission: existing, duplicate: true } })
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: { include: { options: true } } },
    })
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz tidak ditemukan' }, { status: 404 })
    }

    const { answers } = await request.json()
    const score = calculateScore(quiz.questions, answers)

    const submission = await prisma.submission.create({
      data: { userId, quizId, score },
    })

    const pointResult = await postActivityService(userId, 'QUIZ', quizId, score, prisma)

    return NextResponse.json({
      data: { submission, score, points: pointResult.points, level: pointResult.level },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal submit quiz' }, { status: 500 })
  }
}
