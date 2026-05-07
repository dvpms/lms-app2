import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(_request, { params }) {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: params.id },
      include: { questions: { include: { options: true } } },
    })
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz tidak ditemukan' }, { status: 404 })
    }
    return NextResponse.json({ data: quiz })
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

    const body = await request.json()
    if (!body.title) {
      return NextResponse.json({ error: 'Title wajib diisi' }, { status: 400 })
    }

    const quiz = await prisma.quiz.update({
      where: { id: params.id },
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

    await prisma.quiz.delete({ where: { id: params.id } })
    return NextResponse.json({ data: { message: 'Quiz berhasil dihapus' } })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal menghapus quiz' }, { status: 500 })
  }
}
