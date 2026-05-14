import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

function validateMaterialBody(body) {
  const missing = ['subjectId', 'title', 'cards', 'order'].filter((f) => body[f] == null)
  return missing
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const subjectId = searchParams.get('subjectId')

    const materials = await prisma.material.findMany({
      where: subjectId ? { subjectId } : undefined,
      orderBy: { order: 'asc' },
    })
    return NextResponse.json({ data: materials })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal mengambil materials' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const missing = validateMaterialBody(body)
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Field wajib diisi: ${missing.join(', ')}` },
        { status: 400 },
      )
    }

    const material = await prisma.material.create({
      data: {
        subjectId: body.subjectId,
        title: body.title,
        cards: body.cards,
        order: body.order,
      },
    })
    return NextResponse.json({ data: material }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal membuat material' }, { status: 500 })
  }
}
