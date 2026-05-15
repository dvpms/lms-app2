import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(_request, { params }) {
  try {
    const { id } = await params
    const subject = await prisma.subject.findUnique({
      where: { id },
      include: { materials: { orderBy: { order: 'asc' } }, quizzes: true },
    })
    if (!subject) {
      return NextResponse.json({ error: 'Subject tidak ditemukan' }, { status: 404 })
    }
    return NextResponse.json({ data: subject })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal mengambil subject' }, { status: 500 })
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

    const subject = await prisma.subject.update({
      where: { id },
      data: {
        title: body.title,
        activitiesDescription: body.activitiesDescription ?? null,
        icon: body.icon ?? null,
      },
    })
    return NextResponse.json({ data: subject })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal mengupdate subject' }, { status: 500 })
  }
}

export async function DELETE(_request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await prisma.subject.delete({ where: { id } })
    return NextResponse.json({ data: { message: 'Subject berhasil dihapus' } })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal menghapus subject' }, { status: 500 })
  }
}
