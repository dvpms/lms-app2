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
    const quizId = searchParams.get('quizId')
    const userId = session.user.id

    if (!quizId) {
      return NextResponse.json({ error: 'quizId wajib diisi' }, { status: 400 })
    }

    const submission = await prisma.submission.findFirst({
      where: { userId, quizId },
    })

    return NextResponse.json({ data: submission ?? null })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal mengambil submission' }, { status: 500 })
  }
}
