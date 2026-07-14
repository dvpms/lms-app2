import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

const ALLOWED_ROLES = ['STUDENT', 'TEACHER', 'ADMIN']

function normalizeRole(role) {
  if (!role) return null
  const value = String(role).toUpperCase()
  return ALLOWED_ROLES.includes(value) ? value : null
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const role = normalizeRole(searchParams.get('role'))

    const where = role ? { role } : { role: { in: ALLOWED_ROLES } }

    const [users, totalUsers, totalStudents, totalTeachers, totalAdmins] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          points: true,
          level: true,
          avatar: true,
          isApproved: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where: { role: { in: ALLOWED_ROLES } } }),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'TEACHER' } }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
    ])

    return NextResponse.json({
      data: users,
      meta: {
        totalUsers,
        totalStudents,
        totalTeachers,
        totalAdmins,
        activeRole: role ?? 'ALL',
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal mengambil data users' }, { status: 500 })
  }
}