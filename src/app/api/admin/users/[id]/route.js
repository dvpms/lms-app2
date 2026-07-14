import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function DELETE(request, context) {
  try {
    const { params } = context
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Prevent admin from deleting themselves
    if (session.user.id === id) {
      return NextResponse.json({ error: 'Anda tidak dapat menghapus akun Anda sendiri' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 })
    }

    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[delete user]', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server saat menghapus user' }, { status: 500 })
  }
}
