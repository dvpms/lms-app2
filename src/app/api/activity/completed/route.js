import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const idsParam = searchParams.get('ids')

    if (!idsParam) {
      return NextResponse.json({ data: [] })
    }

    const ids = idsParam.split(',').filter(Boolean)

    const logs = await prisma.activityLog.findMany({
      where: {
        userId: session.user.id,
        type: 'GAME',
        activityId: { in: ids },
      },
      select: { activityId: true },
    })

    const completedIds = [...new Set(logs.map((l) => l.activityId))]
    return NextResponse.json({ data: completedIds })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal mengambil data aktivitas' }, { status: 500 })
  }
}
