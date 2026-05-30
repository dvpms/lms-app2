import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

function validateOptions(options) {
  if (!Array.isArray(options) || options.length < 2) return false
  const correctCount = options.filter((o) => o.isCorrect).length
  return correctCount === 1
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    if (!body.quizId || !body.text) {
      return NextResponse.json({ error: 'quizId dan text wajib diisi' }, { status: 400 })
    }
    if (!validateOptions(body.options)) {
      return NextResponse.json(
        { error: 'Tepat satu jawaban benar diperlukan' },
        { status: 400 },
      )
    }

    const question = await prisma.question.create({
      data: {
        quizId: body.quizId,
        text: body.text,
        image: body.image ?? null,
        solutionImage: body.solutionImage ?? null,
        points: body.points ?? 10,
        options: { create: body.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect })) },
      },
      include: { options: true },
    })
    return NextResponse.json({ data: question }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal membuat question' }, { status: 500 })
  }
}
