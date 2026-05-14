'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useSelector } from 'react-redux'
import { Bell } from 'lucide-react'

export default function StudentMobileHeader({ initial, homeHref = '/student/dashboard' }) {
  const { data: session } = useSession()
  const user = useSelector((state) => state.auth.user)
  const displayUser = user ?? session?.user

  const derivedInitial = (displayUser?.name ?? 'S').toString().trim().charAt(0).toUpperCase()
  const safeInitial = (initial ?? derivedInitial ?? 'S').toString().trim().charAt(0).toUpperCase() || 'S'

  return (
    <header className="md:hidden fixed inset-x-0 top-0 z-50 bg-primary text-on-primary rounded-b-3xl shadow-md">
      <div className="px-6 pt-5 pb-6 flex items-center justify-between">
        <Link
          href={homeHref}
          aria-label="Ke Dashboard"
          className="text-2xl font-extrabold tracking-tight hover:opacity-95"
        >
          CeriaEdu
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="h-11 w-11 inline-flex items-center justify-center rounded-full bg-on-primary/10 hover:bg-on-primary/20"
            aria-label="Notifikasi"
          >
            <Bell className="size-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            className="h-11 w-11 inline-flex items-center justify-center rounded-full bg-on-primary/10 hover:bg-on-primary/20 font-bold"
            aria-label="Profil"
          >
            {safeInitial}
          </button>
        </div>
      </div>
    </header>
  )
}
