'use client'

import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useGetSubjectsQuery } from '@/lib/redux/api/subjectsApi'
import { useGetMaterialsQuery } from '@/lib/redux/api/materialsApi'

export default function QuizForm({ initial, onSubmit, onCancel, isLoading }) {
  const { data: subjectsData } = useGetSubjectsQuery()
  const { data: materialsData } = useGetMaterialsQuery()
  const subjects = subjectsData?.data ?? []
  const materials = materialsData?.data ?? []

  const [form, setForm] = useState({
    title: initial?.title ?? '',
    subjectId: initial?.subjectId ?? '',
    materialId: initial?.materialId ?? '',
    questionCount: initial?.questionCount ?? 10,
  })

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: name === 'questionCount' ? Number(value) : value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({
      title: form.title,
      subjectId: form.subjectId || null,
      materialId: form.materialId || null,
      questionCount: form.questionCount,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Judul Quiz" name="title" value={form.title} onChange={handleChange} required />

      <Input
        label="Jumlah Soal per Sesi"
        name="questionCount"
        type="number"
        min={1}
        max={100}
        value={form.questionCount}
        onChange={handleChange}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-on-surface-variant">Subject (opsional)</label>
        <select
          name="subjectId"
          value={form.subjectId}
          onChange={handleChange}
          className="min-h-12 rounded-xl border-2 border-outline-variant bg-surface-container-lowest px-4 py-3 text-on-surface focus:border-primary focus:outline-none"
        >
          <option value="">— Pilih Subject —</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.title}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-on-surface-variant">Material (opsional)</label>
        <select
          name="materialId"
          value={form.materialId}
          onChange={handleChange}
          className="min-h-12 rounded-xl border-2 border-outline-variant bg-surface-container-lowest px-4 py-3 text-on-surface focus:border-primary focus:outline-none"
        >
          <option value="">— Pilih Material —</option>
          {materials.map((m) => (
            <option key={m.id} value={m.id}>{m.title}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-3 justify-end">
        {onCancel && <Button type="button" variant="ghost" onClick={onCancel}>Batal</Button>}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>
    </form>
  )
}
