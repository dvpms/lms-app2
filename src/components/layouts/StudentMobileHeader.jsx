'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { signOut } from 'next-auth/react'
import { Bell, User, LogOut } from 'lucide-react'
import { clearUser } from '@/lib/redux/slices/authSlice'

export default function StudentMobileHeader({ homeHref = '/student/dashboard' }) {
  const dispatch = useDispatch()

  const [userData, setUserData] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch('/api/me')
        if (!res.ok) return
        const json = await res.json()
        setUserData(json.data)
      } catch {
        // silently fail
      }
    }
    fetchMe()
  }, [])

  const name = userData?.name ?? ''
  const email = userData?.email ?? ''
  const safeInitial = name.trim().charAt(0).toUpperCase() || 'S'

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  async function handleLogout() {
    setMenuOpen(false)
    dispatch(clearUser())
    await signOut({ callbackUrl: '/login' })
  }

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

          {/* Profile button + dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="h-11 w-11 inline-flex items-center justify-center rounded-full bg-on-primary/10 hover:bg-on-primary/20 font-bold"
              aria-label="Profil"
              aria-expanded={menuOpen}
            >
              {safeInitial}
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-surface-container-lowest rounded-2xl shadow-[0_8px_24px_rgba(0,93,167,0.16)] border border-outline-variant overflow-hidden z-50">
                {/* User info */}
                <div className="px-4 py-3 border-b border-outline-variant">
                  <p className="font-semibold text-on-surface text-sm truncate">
                    {name || 'Student'}
                  </p>
                  <p className="text-xs text-on-surface-variant truncate">{email}</p>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  <Link
                    href="/student/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors"
                  >
                    <User className="size-4 text-on-surface-variant" />
                    Profil Saya
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-error hover:bg-error-container/30 transition-colors"
                  >
                    <LogOut className="size-4" />
                    Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
