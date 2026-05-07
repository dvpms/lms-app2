'use client'

import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useGetSubjectsQuery } from '@/lib/redux/api/subjectsApi'

function parseCards(raw) {
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export default function MaterialForm({ initial, onSubmit, onCancel, isLoading }) {
  const { data: subjectsData } = useGetSubjectsQuery()
  const subjects = subjectsData?.data ?? []

  const [form, setForm] = useState({
    title: initial?.title ?? '',
    subjectId: initial?.subjectId ?? '',
    order: initial?.order ?? 1,
    cardsRaw: initial?.cards ? JSON.stringify(initial.cards, null, 2) : '[]',
  })
  const [cardsError, setCardsError] = useState('')

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const cards = parseCards(form.cardsRaw)
    if (!cards) {
      setCardsError('Format JSON tidak valid')
      return
    }
    setCardsError('')
    onSubmit({ title: form.title, subjectId: form.subjectId, order: Number(form.order), cards })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input label="Judul" name="title" value={form.title} onChange={handleChange} required />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-on-surface-variant">Subject</label>
        <select
          name="subjectId"
          value={form.subjectId}
          onChange={handleChange}
          required
          className="min-h-12 rounded-xl border-2 border-outline-variant bg-surface-container-lowest px-4 py-3 text-on-surface focus:border-primary focus:outline-none"
        >
          <option value="">Pilih Subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.title}</option>
          ))}
        </select>
      </div>

      <Input label="Urutan" name="order" type="number" min={1} value={form.order} onChange={handleChange} required />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-on-surface-variant">Cards (JSON)</label>
        <textarea
          name="cardsRaw"
          value={form.cardsRaw}
          onChange={handleChange}
          rows={8}
          className="rounded-xl border-2 border-outline-variant bg-surface-container-lowest px-4 py-3 text-on-surface font-mono text-sm focus:border-primary focus:outline-none resize-y"
        />
        {cardsError && <p className="text-sm text-error">{cardsError}</p>}
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
