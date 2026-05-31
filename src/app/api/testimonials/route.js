import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json({ data: testimonials })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal mengambil testimonial' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const rating = Number(body.rating)
    const quote = typeof body.quote === 'string' ? body.quote.trim() : ''

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating harus antara 1 sampai 5' }, { status: 400 })
    }

    if (!quote) {
      return NextResponse.json({ error: 'Testimonial wajib diisi' }, { status: 400 })
    }

    const testimonial = await prisma.testimonial.upsert({
      where: { userId: session.user.id },
      update: {
        rating,
        quote,
      },
      create: {
        userId: session.user.id,
        rating,
        quote,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
          },
        },
      },
    })

    return NextResponse.json({ data: testimonial }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal menyimpan testimonial' }, { status: 500 })
  }
}