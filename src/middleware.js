import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

const ADMIN_PREFIX = '/admin'
const STUDENT_PREFIXES = ['/student/dashboard', '/student/subjects', '/student/materials', '/student/quiz', '/student/games', '/student/leaderboard', '/student/profile']
const TEACHER_ALLOWED_PREFIXES = ['/student/subjects', '/student/materials', '/student/leaderboard', '/student/profile']

function isAdminRoute(pathname) {
  return pathname.startsWith(ADMIN_PREFIX)
}

function isStudentRoute(pathname) {
  return STUDENT_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

function isTeacherAllowedRoute(pathname) {
  return TEACHER_ALLOWED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
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

  if (isStudentRoute(pathname)) {
    if (token.role === 'TEACHER') {
      // Teachers can only access allowed student routes
      if (!isTeacherAllowedRoute(pathname)) {
        return NextResponse.redirect(new URL('/student/subjects', request.url))
      }
    } else if (token.role !== 'STUDENT') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/student/:path*'],
}
