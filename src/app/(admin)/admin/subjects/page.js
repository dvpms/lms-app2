'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2, BookOpen } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'
import SubjectForm from '@/components/features/admin/SubjectForm'
import MaterialForm from '@/components/features/admin/MaterialForm'
import {
  useGetSubjectsQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} from '@/lib/redux/api/subjectsApi'
import {
  useCreateMaterialMutation,
  useUpdateMaterialMutation,
  useDeleteMaterialMutation,
} from '@/lib/redux/api/materialsApi'

export default function SubjectsPage() {
  const { data, isLoading, refetch } = useGetSubjectsQuery()
  const subjects = data?.data ?? []

  const [createSubject, { isLoading: creatingSubject }] = useCreateSubjectMutation()
  const [updateSubject, { isLoading: updatingSubject }] = useUpdateSubjectMutation()
  const [deleteSubject] = useDeleteSubjectMutation()

  const [createMaterial, { isLoading: creatingMaterial }] = useCreateMaterialMutation()
  const [updateMaterial, { isLoading: updatingMaterial }] = useUpdateMaterialMutation()
  const [deleteMaterial] = useDeleteMaterialMutation()

  const [expandedSubjects, setExpandedSubjects] = useState({})

  const [subjectModal, setSubjectModal] = useState({ open: false, subject: null })
  const [materialModal, setMaterialModal] = useState({ open: false, material: null, subjectId: null })
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, type: null, id: null, name: '' })

  function toggleExpand(subjectId) {
    setExpandedSubjects((prev) => ({ ...prev, [subjectId]: !prev[subjectId] }))
  }

  async function handleSubjectSubmit(form) {
    if (subjectModal.subject) {
      await updateSubject({ id: subjectModal.subject.id, ...form })
    } else {
      await createSubject(form)
    }
    setSubjectModal({ open: false, subject: null })
    refetch()
  }

  async function handleMaterialSubmit(form) {
    if (materialModal.material) {
      await updateMaterial({ id: materialModal.material.id, ...form })
    } else {
      await createMaterial(form)
    }
    setMaterialModal({ open: false, material: null, subjectId: null })
    refetch()
  }

  async function handleDeleteConfirm() {
    if (deleteConfirm.type === 'subject') {
      await deleteSubject(deleteConfirm.id)
    } else {
      await deleteMaterial(deleteConfirm.id)
    }
    setDeleteConfirm({ open: false, type: null, id: null, name: '' })
    refetch()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Mata Pelajaran & Materi</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Kelola subject dan materi pembelajaran dalam satu tempat
          </p>
        </div>
        <Button onClick={() => setSubjectModal({ open: true, subject: null })} className="flex items-center">
          <Plus size={16} className="mr-2 " />
          Subject
        </Button>
      </div>

      {subjects.length === 0 && (
        <Card>
          <div className="text-center py-12 text-on-surface-variant">
            <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
            <p className="font-semibold">Belum ada subject</p>
            <p className="text-sm mt-1">Mulai dengan menambahkan mata pelajaran</p>
          </div>
        </Card>
      )}

      <div className="flex flex-col gap-4">
        {subjects.map((subject) => {
          const isExpanded = expandedSubjects[subject.id]
          const materials = subject.materials ?? []

          return (
            <Card key={subject.id}>
              <div className="flex items-center gap-4">
                {subject.icon && (
                  <img
                    src={subject.icon}
                    alt={subject.title}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-on-surface text-lg">{subject.title}</h2>
                    <Badge>{materials.length} materi</Badge>
                  </div>
                  {subject.activitiesDescription && (
                    <p className="text-sm text-on-surface-variant mt-0.5 truncate">
                      {subject.activitiesDescription}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSubjectModal({ open: true, subject })}
                  >
                    <Pencil size={15} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setDeleteConfirm({ open: true, type: 'subject', id: subject.id, name: subject.title })
                    }
                  >
                    <Trash2 size={15} className="text-error" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpand(subject.id)}
                  >
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </Button>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-outline-variant flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-on-surface-variant">Daftar Materi</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center"
                      onClick={() =>
                        setMaterialModal({ open: true, material: null, subjectId: subject.id })
                      }
                    >
                      <Plus size={14} className="mr-1" />
                      Materi
                    </Button>
                  </div>

                  {materials.length === 0 && (
                    <p className="text-sm text-on-surface-variant text-center py-4">
                      Belum ada materi untuk subject ini
                    </p>
                  )}

                  {materials
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((material) => (
                      <div
                        key={material.id}
                        className="flex items-center gap-3 bg-surface-container-low rounded-xl px-4 py-3"
                      >
                        <span className="text-xs font-bold text-on-surface-variant w-6 text-center shrink-0">
                          {material.order}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-on-surface text-sm truncate">{material.title}</p>
                          <p className="text-xs text-on-surface-variant">
                            {Array.isArray(material.cards) ? material.cards.length : 0} card
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setMaterialModal({ open: true, material, subjectId: subject.id })
                            }
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setDeleteConfirm({
                                open: true,
                                type: 'material',
                                id: material.id,
                                name: material.title,
                              })
                            }
                          >
                            <Trash2 size={14} className="text-error" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {/* Subject Modal */}
      <Modal
        isOpen={subjectModal.open}
        onClose={() => setSubjectModal({ open: false, subject: null })}
        size="md"
      >
        <h2 className="text-lg font-semibold text-on-surface mb-4">
          {subjectModal.subject ? 'Edit Subject' : 'Tambah Subject'}
        </h2>
        <SubjectForm
          initial={subjectModal.subject}
          onSubmit={handleSubjectSubmit}
          onCancel={() => setSubjectModal({ open: false, subject: null })}
          isLoading={creatingSubject || updatingSubject}
        />
      </Modal>

      {/* Material Modal */}
      <Modal
        isOpen={materialModal.open}
        onClose={() => setMaterialModal({ open: false, material: null, subjectId: null })}
        size="lg"
      >
        <h2 className="text-lg font-semibold text-on-surface mb-4">
          {materialModal.material ? 'Edit Materi' : 'Tambah Materi'}
        </h2>
        <MaterialForm
          initial={materialModal.material}
          subjectId={materialModal.subjectId}
          onSubmit={handleMaterialSubmit}
          onCancel={() => setMaterialModal({ open: false, material: null, subjectId: null })}
          isLoading={creatingMaterial || updatingMaterial}
        />
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, type: null, id: null, name: '' })}
      >
        <h2 className="text-lg font-semibold text-on-surface mb-2">Konfirmasi Hapus</h2>
        <p className="text-on-surface-variant text-sm mb-6">
          Yakin ingin menghapus <span className="font-semibold text-on-surface">"{deleteConfirm.name}"</span>?
          {deleteConfirm.type === 'subject' && (
            <span className="block mt-1 text-error">Semua materi dalam subject ini juga akan terhapus.</span>
          )}
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="ghost"
            onClick={() => setDeleteConfirm({ open: false, type: null, id: null, name: '' })}
          >
            Batal
          </Button>
          <Button variant="secondary" onClick={handleDeleteConfirm}>
            Hapus
          </Button>
        </div>
      </Modal>
    </div>
  )
}
