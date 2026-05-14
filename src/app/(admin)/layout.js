'use client'

import AdminSidebar from '@/components/layouts/AdminSidebar'

export default function AdminLayout({ children }) {
  return (
    <>
      <AdminSidebar />
      <main className="ml-64 min-h-screen bg-background p-6">
        {children}
      </main>
    </>
  )
}
