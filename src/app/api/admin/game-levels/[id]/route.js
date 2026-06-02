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

    for (const key of ['levelKey', 'order', 'difficulty', 'points', 'payload', 'isActive']) {
      if (body[key] !== undefined) {
        updates[key] = key === 'order' || key === 'difficulty' || key === 'points'
          ? Number(body[key])
          : body[key]
      }
    }

    const level = await prisma.gameLevel.update({
      where: { id },
      data: updates,
    })

    return NextResponse.json({ data: level })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal mengupdate level game' }, { status: 500 })
  }
}

export async function DELETE(_request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await prisma.gameLevel.delete({ where: { id } })
    return NextResponse.json({ data: { message: 'Level berhasil dihapus' } })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal menghapus level game' }, { status: 500 })
  }
}