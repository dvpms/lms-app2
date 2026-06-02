'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BookOpen, HelpCircle, Users, MessageCircle, School, Gamepad2 } from 'lucide-react'
import clsx from 'clsx'

const navLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/subjects', label: 'Mata Pelajaran & Materi', icon: BookOpen },
  { href: '/admin/quizzes', label: 'Quizzes', icon: HelpCircle },
  { href: '/admin/testimonials', label: 'Testimonial', icon: MessageCircle },
  { href: '/admin/users', label: 'Users', icon: School },
  { href: '/admin/games', label: 'Games', icon: Gamepad2 },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 w-64 bg-primary flex flex-col shadow-[0_4px_12px_rgba(0,93,167,0.14)]">
      <div className="px-6 py-5 border-b border-on-primary/20">
        <span className="text-on-primary font-bold text-xl">CeriaEdu</span>
        <p className="text-on-primary/60 text-xs mt-1">Admin Panel</p>
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors',
                active
                  ? 'bg-on-primary/20 text-on-primary'
                  : 'text-on-primary/70 hover:text-on-primary hover:bg-on-primary/10',
              )}
            >
              <Icon className="size-5" />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
