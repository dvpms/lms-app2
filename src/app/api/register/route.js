import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const { name, email, password, role } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email sudah digunakan' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Only allow STUDENT and TEACHER roles via registration
    const allowedRoles = ['STUDENT', 'TEACHER']
    const assignedRole = allowedRoles.includes(role) ? role : 'STUDENT'

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: assignedRole },
      select: { id: true, name: true, email: true, role: true },
    })

    return NextResponse.json({ data: user }, { status: 201 })
  } catch (error) {
    console.error('[register]', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
