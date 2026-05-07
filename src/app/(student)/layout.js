'use client'

import StudentNavigation from '@/components/layouts/StudentNavigation'

export default function StudentLayout({ children }) {
  return (
    <>
      <StudentNavigation />
      <main className="md:pt-16 pb-20 md:pb-0 min-h-screen bg-background">
        {children}
      </main>
    </>
  )
}
