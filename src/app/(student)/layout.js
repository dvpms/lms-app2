'use client'

import StudentNavigation from '@/components/layouts/StudentNavigation'
import StudentMobileHeader from '@/components/layouts/StudentMobileHeader'

export default function StudentLayout({ children }) {
  return (
    <>
      <StudentMobileHeader />
      <StudentNavigation />
      <main className="pt-24 md:pt-16 pb-20 md:pb-0 min-h-screen bg-background">
        {children}
      </main>
    </>
  )
}
