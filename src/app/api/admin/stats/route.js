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

    const [totalStudents, totalSubmissions, totalMaterials] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.submission.count(),
      prisma.material.count(),
    ])

    return NextResponse.json({ data: { totalStudents, totalSubmissions, totalMaterials } })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal mengambil statistik' }, { status: 500 })
  }
}
