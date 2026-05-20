import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(_request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: { questions: { include: { options: true } } },
    })
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz tidak ditemukan' }, { status: 404 })
    }

    // Include existing submission for the current user (if logged in as student)
    let existingSubmission = null
    if (session?.user?.id) {
      existingSubmission = await prisma.submission.findFirst({
        where: { userId: session.user.id, quizId: id },
      })
    }

    return NextResponse.json({ data: { ...quiz, existingSubmission } })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal mengambil quiz' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    if (!body.title) {
      return NextResponse.json({ error: 'Title wajib diisi' }, { status: 400 })
    }

    const quiz = await prisma.quiz.update({
      where: { id },
      data: {
        title: body.title,
        materialId: body.materialId ?? null,
        subjectId: body.subjectId ?? null,
      },
    })
    return NextResponse.json({ data: quiz })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal mengupdate quiz' }, { status: 500 })
  }
}

export async function DELETE(_request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await prisma.quiz.delete({ where: { id } })
    return NextResponse.json({ data: { message: 'Quiz berhasil dihapus' } })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal menghapus quiz' }, { status: 500 })
  }
}
