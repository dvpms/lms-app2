import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(_request, { params }) {
  try {
    const material = await prisma.material.findUnique({
      where: { id: params.id },
      include: { subject: true, quizzes: true },
    })
    if (!material) {
      return NextResponse.json({ error: 'Material tidak ditemukan' }, { status: 404 })
    }
    return NextResponse.json({ data: material })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal mengambil material' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const material = await prisma.material.update({
      where: { id: params.id },
      data: {
        title: body.title,
        cards: body.cards,
        order: body.order,
        subjectId: body.subjectId,
      },
    })
    return NextResponse.json({ data: material })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal mengupdate material' }, { status: 500 })
  }
}

export async function DELETE(_request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.material.delete({ where: { id: params.id } })
    return NextResponse.json({ data: { message: 'Material berhasil dihapus' } })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal menghapus material' }, { status: 500 })
  }
}
