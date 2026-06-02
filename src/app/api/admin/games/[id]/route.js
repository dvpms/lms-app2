import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

function isAdmin(session) {
  return !!session?.user && session.user.role === 'ADMIN'
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const updates = {}

    for (const key of ['type', 'title', 'description', 'emoji']) {
      if (typeof body[key] === 'string' && body[key].trim()) {
        updates[key] = body[key].trim()
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'Tidak ada data yang diupdate' }, { status: 400 })
    }

    const game = await prisma.game.update({
      where: { id },
      data: updates,
    })

    return NextResponse.json({ data: game })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal mengupdate game' }, { status: 500 })
  }
}

export async function DELETE(_request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await prisma.game.delete({ where: { id } })
    return NextResponse.json({ data: { message: 'Game berhasil dihapus' } })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal menghapus game' }, { status: 500 })
  }
}