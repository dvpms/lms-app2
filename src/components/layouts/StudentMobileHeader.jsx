'use client'

import Link from 'next/link'
import { Bell } from 'lucide-react'
import StudentProfileMenu from '@/components/layouts/StudentProfileMenu'

export default function StudentMobileHeader({ homeHref = '/student/dashboard' }) {
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

          <StudentProfileMenu />
        </div>
      </div>
    </header>
  )
}
