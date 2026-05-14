import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { postActivityService } from '@/lib/pointService'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, activityId, points } = body

    if (!type || !activityId || points == null) {
      return NextResponse.json(
        { error: 'type, activityId, dan points wajib diisi' },
        { status: 400 },
      )
    }

    const result = await postActivityService(session.user.id, type, activityId, points, prisma)
    return NextResponse.json({ data: result })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal mencatat aktivitas' }, { status: 500 })
  }
}
