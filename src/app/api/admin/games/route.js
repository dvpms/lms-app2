import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

function isAdmin(session) {
  return !!session?.user && session.user.role === 'ADMIN'
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const games = await prisma.game.findMany({
      include: {
        levels: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({ data: games })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal mengambil data game admin' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const type = typeof body.type === 'string' ? body.type.trim() : ''
    const title = typeof body.title === 'string' ? body.title.trim() : ''
    const description = typeof body.description === 'string' ? body.description.trim() : ''
    const emoji = typeof body.emoji === 'string' ? body.emoji.trim() : ''

    if (!type || !title || !description || !emoji) {
      return NextResponse.json({ error: 'type, title, description, dan emoji wajib diisi' }, { status: 400 })
    }

    const game = await prisma.game.create({
      data: { type, title, description, emoji },
    })

    return NextResponse.json({ data: game }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal membuat game' }, { status: 500 })
  }
}