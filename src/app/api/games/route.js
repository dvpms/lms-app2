import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      where: { isActive: true },
      include: {
        levels: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({ data: games })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal mengambil data game' }, { status: 500 })
  }
}