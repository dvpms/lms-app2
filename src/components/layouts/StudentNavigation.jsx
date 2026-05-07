'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSelector } from 'react-redux'
import { Home, BookOpen, Trophy, User } from 'lucide-react'
import clsx from 'clsx'

const navLinks = [
  { href: '/student/dashboard', label: 'Dashboard', icon: Home },
  { href: '/student/subjects', label: 'Subjects', icon: BookOpen },
  { href: '/student/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/student/profile', label: 'Profile', icon: User },
]

function NavLink({ href, label, icon: Icon, active, mobile }) {
  return (
    <Link
      href={href}
      className={clsx(
        'flex items-center gap-2 transition-colors',
        mobile
          ? clsx(
              'flex-col items-center justify-center gap-1 px-3 py-2 text-xs font-medium',
              active ? 'text-primary' : 'text-on-surface-variant',
            )
          : clsx(
              'px-4 py-2 rounded-xl text-sm font-semibold',
              active
                ? 'bg-on-primary/20 text-on-primary'
                : 'text-on-primary/80 hover:text-on-primary hover:bg-on-primary/10',
            ),
      )}
    >
      <Icon className={mobile ? 'size-5' : 'size-4'} />
      <span>{label}</span>
    </Link>
  )
}

export default function StudentNavigation() {
  const pathname = usePathname()
  const user = useSelector((state) => state.auth.user)

  return (
    <>
      {/* Desktop top bar */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-40 h-16 bg-primary items-center justify-between px-6 shadow-[0_4px_12px_rgba(0,93,167,0.08)]">
        <span className="text-on-primary font-bold text-lg">CeriaEdu</span>
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              {...link}
              active={pathname.startsWith(link.href)}
              mobile={false}
            />
          ))}
        </nav>
        {user && (
          <div className="flex items-center gap-3 text-on-primary text-sm font-semibold">
            <span>⭐ {user.points} pts</span>
            <span className="bg-on-primary/20 rounded-full px-3 py-1">Lv.{user.level}</span>
          </div>
        )}
      </header>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest border-t border-outline-variant flex items-center justify-around px-2 py-1 shadow-[0_-4px_12px_rgba(0,93,167,0.08)]">
        {navLinks.map((link) => (
          <NavLink
            key={link.href}
            {...link}
            active={pathname.startsWith(link.href)}
            mobile={true}
          />
        ))}
      </nav>
    </>
  )
}
