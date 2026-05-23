import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, role: true, points: true, level: true, avatar: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ data: user })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal mengambil data user' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { avatar } = body

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { avatar: avatar ?? null },
      select: { id: true, name: true, email: true, role: true, points: true, level: true, avatar: true },
    })

    return NextResponse.json({ data: user })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal mengupdate profil' }, { status: 500 })
  }
}
