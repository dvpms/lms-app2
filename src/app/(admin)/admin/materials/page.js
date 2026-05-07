'use client'

import { useState } from 'react'
import {
  useGetMaterialsQuery,
  useCreateMaterialMutation,
  useUpdateMaterialMutation,
  useDeleteMaterialMutation,
} from '@/lib/redux/api/materialsApi'
import MaterialForm from '@/components/features/admin/MaterialForm'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'

export default function AdminMaterialsPage() {
  const { data, isLoading } = useGetMaterialsQuery()
  const [createMaterial, { isLoading: isCreating }] = useCreateMaterialMutation()
  const [updateMaterial, { isLoading: isUpdating }] = useUpdateMaterialMutation()
  const [deleteMaterial] = useDeleteMaterialMutation()

  const [showCreate, setShowCreate] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const materials = data?.data ?? []

  async function handleCreate(form) {
    await createMaterial(form)
    setShowCreate(false)
  }

  async function handleUpdate(form) {
    await updateMaterial({ id: editTarget.id, ...form })
    setEditTarget(null)
  }

  async function handleDelete() {
    await deleteMaterial(deleteTarget.id)
    setDeleteTarget(null)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-on-surface">Materials</h1>
        <Button onClick={() => setShowCreate(true)}>+ Tambah Material</Button>
      </div>

      <div className="flex flex-col gap-3">
        {materials.map((material) => (
          <Card key={material.id} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Badge variant="secondary">#{material.order}</Badge>
              <p className="font-semibold text-on-surface">{material.title}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditTarget(material)}>Edit</Button>
              <Button variant="secondary" size="sm" onClick={() => setDeleteTarget(material)}>Hapus</Button>
            </div>
          </Card>
        ))}
        {materials.length === 0 && (
          <p className="text-on-surface-variant text-center py-8">Belum ada material.</p>
        )}
      </div>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)}>
        <h2 className="text-xl font-bold text-on-surface mb-4">Tambah Material</h2>
        <MaterialForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} isLoading={isCreating} />
      </Modal>

      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)}>
        <h2 className="text-xl font-bold text-on-surface mb-4">Edit Material</h2>
        <MaterialForm initial={editTarget} onSubmit={handleUpdate} onCancel={() => setEditTarget(null)} isLoading={isUpdating} />
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <h2 className="text-xl font-bold text-on-surface mb-4">Hapus Material</h2>
        <p className="text-on-surface-variant mb-6">
          Yakin ingin menghapus <strong>{deleteTarget?.title}</strong>?
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Batal</Button>
          <Button variant="secondary" onClick={handleDelete}>Hapus</Button>
        </div>
      </Modal>
    </div>
  )
}
