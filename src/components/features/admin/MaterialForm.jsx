'use client'

import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import CardBuilder from '@/components/features/admin/CardBuilder'

export default function MaterialForm({ initial, subjectId, onSubmit, onCancel, isLoading }) {
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    order: initial?.order ?? 1,
    cards: initial?.cards ?? [],
  })

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleCardsChange(cards) {
    setForm((prev) => ({ ...prev, cards }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({
      title: form.title,
      subjectId,
      order: Number(form.order),
      cards: form.cards,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Judul Materi"
        name="title"
        value={form.title}
        onChange={handleChange}
        required
      />
      <Input
        label="Urutan"
        name="order"
        type="number"
        min={1}
        value={form.order}
        onChange={handleChange}
        required
      />
      <CardBuilder value={form.cards} onChange={handleCardsChange} />
      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Batal
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>
    </form>
  )
}
