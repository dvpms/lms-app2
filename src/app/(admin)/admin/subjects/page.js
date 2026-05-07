'use client'

import { useState } from 'react'
import {
  useGetSubjectsQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} from '@/lib/redux/api/subjectsApi'
import SubjectForm from '@/components/features/admin/SubjectForm'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'

export default function AdminSubjectsPage() {
  const { data, isLoading } = useGetSubjectsQuery()
  const [createSubject, { isLoading: isCreating }] = useCreateSubjectMutation()
  const [updateSubject, { isLoading: isUpdating }] = useUpdateSubjectMutation()
  const [deleteSubject] = useDeleteSubjectMutation()

  const [showCreate, setShowCreate] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const subjects = data?.data ?? []

  async function handleCreate(form) {
    await createSubject(form)
    setShowCreate(false)
  }

  async function handleUpdate(form) {
    await updateSubject({ id: editTarget.id, ...form })
    setEditTarget(null)
  }

  async function handleDelete() {
    await deleteSubject(deleteTarget.id)
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
        <h1 className="text-3xl font-bold text-on-surface">Subjects</h1>
        <Button onClick={() => setShowCreate(true)}>+ Tambah Subject</Button>
      </div>

      <div className="flex flex-col gap-3">
        {subjects.map((subject) => (
          <Card key={subject.id} className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-on-surface">{subject.title}</p>
              {subject.activitiesDescription && (
                <p className="text-sm text-on-surface-variant">{subject.activitiesDescription}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditTarget(subject)}>
                Edit
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setDeleteTarget(subject)}>
                Hapus
              </Button>
            </div>
          </Card>
        ))}
        {subjects.length === 0 && (
          <p className="text-on-surface-variant text-center py-8">Belum ada subject.</p>
        )}
      </div>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)}>
        <h2 className="text-xl font-bold text-on-surface mb-4">Tambah Subject</h2>
        <SubjectForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} isLoading={isCreating} />
      </Modal>

      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)}>
        <h2 className="text-xl font-bold text-on-surface mb-4">Edit Subject</h2>
        <SubjectForm initial={editTarget} onSubmit={handleUpdate} onCancel={() => setEditTarget(null)} isLoading={isUpdating} />
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <h2 className="text-xl font-bold text-on-surface mb-4">Hapus Subject</h2>
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
