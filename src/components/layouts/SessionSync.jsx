'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useDispatch } from 'react-redux'
import { setUser, clearUser } from '@/lib/redux/slices/authSlice'

/**
 * Syncs NextAuth session into Redux authSlice.
 * Mount this once inside the student layout.
 */
export default function SessionSync() {
  const { data: session, status } = useSession()
  const dispatch = useDispatch()

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      dispatch(setUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        points: session.user.points ?? 0,
        level: session.user.level ?? 1,
      }))
    } else if (status === 'unauthenticated') {
      dispatch(clearUser())
    }
  }, [session, status, dispatch])

  return null
}
