import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { sendApprovalEmail } from '@/lib/email'

export async function POST(request, context) {
  try {
    const { params } = context
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
    }

    if (user.isApproved) {
      return NextResponse.json({ error: 'User sudah disetujui sebelumnya' }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isApproved: true },
      select: { id: true, name: true, email: true, role: true, isApproved: true }
    })

    // Send email notification (no password provided since they registered themselves)
    await sendApprovalEmail({ email: user.email, name: user.name })

    return NextResponse.json({ data: updatedUser }, { status: 200 })
  } catch (error) {
    console.error('[approve user]', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server saat menyetujui user' }, { status: 500 })
  }
}
