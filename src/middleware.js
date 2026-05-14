import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

const ADMIN_PREFIX = '/admin'
const STUDENT_PREFIXES = ['/dashboard', '/subjects', '/materials', '/quiz', '/games', '/leaderboard', '/profile']

function isAdminRoute(pathname) {
  return pathname.startsWith(ADMIN_PREFIX)
}

function isStudentRoute(pathname) {
  return STUDENT_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export async function middleware(request) {
  const { pathname } = request.nextUrl
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAdminRoute(pathname) && token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isStudentRoute(pathname) && token.role !== 'STUDENT') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/subjects/:path*', '/materials/:path*', '/quiz/:path*', '/games/:path*', '/leaderboard/:path*', '/profile/:path*'],
}
