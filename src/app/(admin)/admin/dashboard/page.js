'use client'

import { useGetAdminStatsQuery } from '@/lib/redux/api/adminApi'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'

function StatCard({ label, value, emoji }) {
  return (
    <Card className="flex flex-col gap-2">
      <span className="text-3xl">{emoji}</span>
      <p className="text-4xl font-bold text-primary">{value ?? '—'}</p>
      <p className="text-sm text-on-surface-variant">{label}</p>
    </Card>
  )
}

export default function AdminDashboardPage() {
  const { data, isLoading, isError } = useGetAdminStatsQuery()
  const stats = data?.data

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spinner />
      </div>
    )
  }

  if (isError) {
    return <p className="text-error text-center p-6">Gagal memuat statistik.</p>
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-on-surface">Dashboard Admin</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Siswa" value={stats?.totalStudents} emoji="👨‍🎓" />
        <StatCard label="Total Submission" value={stats?.totalSubmissions} emoji="📝" />
        <StatCard label="Total Materi" value={stats?.totalMaterials} emoji="📚" />
      </div>
    </div>
  )
}
