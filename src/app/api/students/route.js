import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: { id: true, name: true, email: true, points: true, level: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ data: students })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal mengambil data students' }, { status: 500 })
  }
}
