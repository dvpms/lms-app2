'use client'

import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import ImageUpload from '@/components/features/admin/ImageUpload'

export default function SubjectForm({ initial, onSubmit, onCancel, isLoading }) {
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    activitiesDescription: initial?.activitiesDescription ?? '',
    icon: initial?.icon ?? '',
  })

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleIconUpload(url) {
    setForm((prev) => ({ ...prev, icon: url }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Judul"
        name="title"
        value={form.title}
        onChange={handleChange}
        required
      />
      <Input
        label="Deskripsi Aktivitas"
        name="activitiesDescription"
        value={form.activitiesDescription}
        onChange={handleChange}
      />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-on-surface-variant">
          Gambar Subject
        </label>
        <ImageUpload
          currentUrl={form.icon}
          onUpload={handleIconUpload}
          folder="ceriaedu/subjects"
        />
      </div>
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
