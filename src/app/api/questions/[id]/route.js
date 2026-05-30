import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

function validateOptions(options) {
  if (!Array.isArray(options) || options.length < 2) return false
  const correctCount = options.filter((o) => o.isCorrect).length
  return correctCount === 1
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    if (body.options !== undefined && !validateOptions(body.options)) {
      return NextResponse.json(
        { error: 'Tepat satu jawaban benar diperlukan' },
        { status: 400 },
      )
    }

    const question = await prisma.question.update({
      where: { id },
      data: {
        text: body.text,
        image: body.image ?? null,
        solutionImage: body.solutionImage ?? null,
        points: body.points,
        ...(body.options && {
          options: {
            deleteMany: {},
            create: body.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect })),
          },
        }),
      },
      include: { options: true },
    })
    return NextResponse.json({ data: question })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal mengupdate question' }, { status: 500 })
  }
}

export async function DELETE(_request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await prisma.question.delete({ where: { id } })
    return NextResponse.json({ data: { message: 'Question berhasil dihapus' } })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal menghapus question' }, { status: 500 })
  }
}
