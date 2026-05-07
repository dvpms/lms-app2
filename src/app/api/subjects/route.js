import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      include: { materials: true, quizzes: true },
    })
    return NextResponse.json({ data: subjects })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal mengambil data subjects' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    if (!body.title) {
      return NextResponse.json({ error: 'Title wajib diisi' }, { status: 400 })
    }

    const subject = await prisma.subject.create({
      data: {
        title: body.title,
        activitiesDescription: body.activitiesDescription ?? null,
        icon: body.icon ?? null,
      },
    })
    return NextResponse.json({ data: subject }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal membuat subject' }, { status: 500 })
  }
}
