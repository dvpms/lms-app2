'use client'

import { useEffect, useMemo, useState } from 'react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import { Users, UserRound, GraduationCap, Plus } from 'lucide-react'

const FILTERS = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Student', value: 'STUDENT' },
  { label: 'Teacher', value: 'TEACHER' },
]

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function RoleIcon({ role }) {
  if (role === 'TEACHER') return <GraduationCap className="size-5 text-primary" />
  if (role === 'ADMIN') return <Users className="size-5 text-tertiary" />
  return <UserRound className="size-5 text-secondary" />
}

export default function AdminUsersPage() {
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [users, setUsers] = useState([])
  const [meta, setMeta] = useState({ totalUsers: 0, totalStudents: 0, totalTeachers: 0, totalAdmins: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newUserData, setNewUserData] = useState({ name: '', email: '', password: '', role: 'TEACHER' })
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [activeFilter])

  async function fetchUsers() {
    try {
      setIsLoading(true)
      setIsError(false)

      const params = new URLSearchParams()
      if (activeFilter !== 'ALL') {
        params.set('role', activeFilter)
      }

      const res = await fetch(`/api/admin/users${params.toString() ? `?${params.toString()}` : ''}`)
      const json = await res.json()
      if (!res.ok) {
        setIsError(true)
        return
      }

      setUsers(json.data ?? [])
      setMeta(json.meta ?? { totalUsers: 0, totalStudents: 0, totalTeachers: 0, totalAdmins: 0 })
    } catch {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreateUser(e) {
    e.preventDefault()
    setIsCreating(true)
    setCreateError('')

    try {
      const res = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserData),
      })
      const data = await res.json()
      if (!res.ok) {
        setCreateError(data.error || 'Gagal membuat user')
      } else {
        setIsCreateModalOpen(false)
        setNewUserData({ name: '', email: '', password: '', role: 'TEACHER' })
        fetchUsers() // refresh list
      }
    } catch (err) {
      setCreateError('Terjadi kesalahan server')
    } finally {
      setIsCreating(false)
    }
  }

  async function handleApproveUser(id) {
    // dynamically import Swal or use window.Swal if available, but it's better to just import it at top
    try {
      const res = await fetch(`/api/admin/users/${id}/approve`, {
        method: 'POST',
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error || 'Gagal menyetujui user')
        return
      }
      // Refresh user list
      fetchUsers()
    } catch (err) {
      alert('Terjadi kesalahan server saat menyetujui user')
    }
  }

  const summaryCards = useMemo(() => ([
    { label: 'Total User', value: meta.totalUsers, icon: <Users className="size-6 text-primary" /> },
    { label: 'Student', value: meta.totalStudents, icon: <UserRound className="size-6 text-secondary" /> },
    { label: 'Teacher', value: meta.totalTeachers, icon: <GraduationCap className="size-6 text-tertiary" /> },
  ]), [meta])

  if (isLoading && users.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spinner />
      </div>
    )
  }

  if (isError && users.length === 0) {
    return <p className="text-error text-center p-6">Gagal memuat data users.</p>
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-on-surface">Users</h1>
            <p className="text-sm text-on-surface-variant">Kelola akun student, teacher, dan admin.</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
            <Plus size={18} />
            Tambah User
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryCards.map((item) => (
          <Card key={item.label} className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-surface-container-low flex items-center justify-center">
              {item.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-on-surface">{item.value}</p>
              <p className="text-sm text-on-surface-variant">{item.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <Button
            key={filter.value}
            variant={activeFilter === filter.value ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveFilter(filter.value)}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {users.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-on-surface-variant">
            <Users size={40} className="mx-auto mb-3 opacity-40" />
            <p className="font-semibold">Belum ada user</p>
            <p className="text-sm mt-1">Data user akan muncul di sini.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {users.map((user) => (
            <Card key={user.id} className="flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="size-14 rounded-full bg-surface-container-low ring-2 ring-outline-variant flex items-center justify-center overflow-hidden shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <RoleIcon role={user.role} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="font-semibold text-on-surface truncate">{user.name}</p>
                      <p className="text-sm text-on-surface-variant truncate">{user.email}</p>
                    </div>
                    <Badge variant={user.role === 'TEACHER' ? 'primary' : (user.role === 'ADMIN' ? 'tertiary' : 'secondary')}>
                      {user.role === 'ADMIN' ? 'Admin' : user.role}
                    </Badge>
                  </div>

                  <p className="text-xs text-on-surface-variant mt-2">Terdaftar {formatDate(user.createdAt)}</p>
                  
                  {!user.isApproved && (
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs font-semibold text-error bg-error/10 px-2 py-1 rounded-md">Pending Approval</span>
                      <Button size="sm" variant="success" onClick={() => handleApproveUser(user.id)}>
                        Setujui
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-surface-container-low p-3">
                  <p className="text-xs text-on-surface-variant">Level</p>
                  <p className="font-semibold text-on-surface">Lv. {user.level}</p>
                </div>
                <div className="rounded-xl bg-surface-container-low p-3">
                  <p className="text-xs text-on-surface-variant">Poin</p>
                  <p className="font-semibold text-on-surface">{user.points}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create User Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
        <h2 className="text-xl font-bold text-on-surface mb-4">Tambah User Baru</h2>
        <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
          <Input 
            label="Nama Lengkap" 
            placeholder="John Doe" 
            required 
            value={newUserData.name}
            onChange={(e) => setNewUserData(prev => ({ ...prev, name: e.target.value }))}
          />
          <Input 
            label="Email" 
            type="email" 
            placeholder="john@example.com" 
            required 
            value={newUserData.email}
            onChange={(e) => setNewUserData(prev => ({ ...prev, email: e.target.value }))}
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="Minimal 6 karakter" 
            required 
            value={newUserData.password}
            onChange={(e) => setNewUserData(prev => ({ ...prev, password: e.target.value }))}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-on-surface-variant">Role</label>
            <select
              className="w-full min-h-12 rounded-xl bg-surface-container-low px-4 text-on-surface outline-none ring-1 ring-outline-variant focus:ring-2 focus:ring-primary transition-all"
              value={newUserData.role}
              onChange={(e) => setNewUserData(prev => ({ ...prev, role: e.target.value }))}
            >
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {createError && <p className="text-sm text-error">{createError}</p>}

          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Batal</Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Menyimpan...' : 'Simpan User'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}