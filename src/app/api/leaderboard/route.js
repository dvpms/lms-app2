import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

function buildRankedList(users) {
  return users.map((user, index) => ({
    rank: index + 1,
    id: user.id,
    name: user.name,
    points: user.points,
    level: user.level,
  }))
}

function findCurrentUserEntry(rankedList, userId) {
  return rankedList.find((entry) => entry.id === userId) ?? null
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const users = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      orderBy: { points: 'desc' },
      select: { id: true, name: true, points: true, level: true },
    })

    const rankedList = buildRankedList(users)
    const currentUser = findCurrentUserEntry(rankedList, session.user.id)

    return NextResponse.json({ data: { leaderboard: rankedList, currentUser } })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal mengambil leaderboard' }, { status: 500 })
  }
}
