import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

function isAdmin(session) {
  return !!session?.user && session.user.role === 'ADMIN'
}

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!isAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: gameId } = await params
    const body = await request.json()
    const levelKey = typeof body.levelKey === 'string' ? body.levelKey.trim() : ''
    const order = Number(body.order)
    const difficulty = Number(body.difficulty)
    const points = Number(body.points)
    const payload = body.payload

    if (!levelKey || !Number.isInteger(order) || !Number.isInteger(difficulty) || !Number.isInteger(points) || payload == null) {
      return NextResponse.json({ error: 'levelKey, order, difficulty, points, dan payload wajib diisi' }, { status: 400 })
    }

    const level = await prisma.gameLevel.create({
      data: {
        gameId,
        levelKey,
        order,
        difficulty,
        points,
        payload,
      },
    })

    return NextResponse.json({ data: level }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal membuat level game' }, { status: 500 })
  }
}