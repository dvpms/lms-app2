import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const materialId = searchParams.get('materialId')
    const subjectId = searchParams.get('subjectId')

    const quizzes = await prisma.quiz.findMany({
      where: {
        ...(materialId ? { materialId } : {}),
        ...(subjectId ? { subjectId } : {}),
      },
      include: {
        questions: { include: { options: true } },
        material: { select: { id: true, title: true } },
        subject: { select: { id: true, title: true } },
      },
    })
    return NextResponse.json({ data: quizzes })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal mengambil quizzes' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    if (!body.title) {
      return NextResponse.json({ error: 'Title wajib diisi' }, { status: 400 })
    }
    if (!body.materialId && !body.subjectId) {
      return NextResponse.json(
        { error: 'materialId atau subjectId wajib diisi' },
        { status: 400 },
      )
    }

    const quiz = await prisma.quiz.create({
      data: {
        title: body.title,
        materialId: body.materialId ?? null,
        subjectId: body.subjectId ?? null,
        questionCount: body.questionCount ?? 10,
      },
    })
    return NextResponse.json({ data: quiz }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal membuat quiz' }, { status: 500 })
  }
}
