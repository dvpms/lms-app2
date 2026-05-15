'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import ImageUpload from '@/components/features/admin/ImageUpload'

const EMPTY_OPTION = { text: '', isCorrect: false }

function buildInitialOptions(options) {
  if (Array.isArray(options) && options.length >= 2) {
    return options.map((o) => ({ text: o.text, isCorrect: o.isCorrect }))
  }
  return [{ ...EMPTY_OPTION }, { ...EMPTY_OPTION }]
}

export default function QuestionForm({ quizId, initial, onSubmit, onCancel, isLoading }) {
  const [form, setForm] = useState({
    text: initial?.text ?? '',
    image: initial?.image ?? '',
    points: initial?.points ?? 10,
    options: buildInitialOptions(initial?.options),
  })
  const [error, setError] = useState('')

  function handleFieldChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: name === 'points' ? Number(value) : value }))
  }

  function handleOptionTextChange(index, value) {
    setForm((prev) => {
      const options = prev.options.map((o, i) => (i === index ? { ...o, text: value } : o))
      return { ...prev, options }
    })
  }

  function handleCorrectChange(index) {
    setForm((prev) => {
      const options = prev.options.map((o, i) => ({ ...o, isCorrect: i === index }))
      return { ...prev, options }
    })
  }

  function addOption() {
    setForm((prev) => ({ ...prev, options: [...prev.options, { ...EMPTY_OPTION }] }))
  }

  function removeOption(index) {
    if (form.options.length <= 2) return
    setForm((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }))
  }

  function handleImageUpload(url) {
    setForm((prev) => ({ ...prev, image: url }))
  }

  function validate() {
    if (!form.text.trim()) return 'Teks soal wajib diisi'
    if (form.options.some((o) => !o.text.trim())) return 'Semua pilihan jawaban wajib diisi'
    const correctCount = form.options.filter((o) => o.isCorrect).length
    if (correctCount !== 1) return 'Tepat satu jawaban benar diperlukan'
    return null
  }

  function handleSubmit(e) {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')
    onSubmit({
      quizId,
      text: form.text.trim(),
      image: form.image || null,
      points: form.points,
      options: form.options,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        label="Teks Soal"
        name="text"
        value={form.text}
        onChange={handleFieldChange}
        required
      />

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-on-surface-variant">
          Gambar Soal <span className="font-normal text-on-surface-variant/60">(opsional)</span>
        </label>
        <ImageUpload
          onUpload={handleImageUpload}
          currentUrl={form.image || null}
          folder="ceriaedu/questions"
        />
      </div>

      <Input
        label="Poin"
        name="points"
        type="number"
        min={1}
        value={form.points}
        onChange={handleFieldChange}
      />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-on-surface-variant">
            Pilihan Jawaban
          </label>
          <Button type="button" variant="ghost" size="sm" onClick={addOption}>
            <Plus size={14} className="mr-1" />
            Tambah
          </Button>
        </div>

        {form.options.map((option, index) => (
          <div key={index} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleCorrectChange(index)}
              className={`size-5 rounded-full border-2 shrink-0 transition-colors ${
                option.isCorrect
                  ? 'border-secondary bg-secondary'
                  : 'border-outline-variant bg-surface-container-lowest'
              }`}
              title="Tandai sebagai jawaban benar"
            />
            <input
              type="text"
              value={option.text}
              onChange={(e) => handleOptionTextChange(index, e.target.value)}
              placeholder={`Pilihan ${index + 1}`}
              className="flex-1 min-h-12 rounded-xl border-2 border-outline-variant bg-surface-container-lowest px-4 py-3 text-on-surface text-sm focus:border-primary focus:outline-none"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeOption(index)}
              disabled={form.options.length <= 2}
            >
              <Trash2 size={14} className="text-error" />
            </Button>
          </div>
        ))}

        <p className="text-xs text-on-surface-variant">
          Klik lingkaran hijau untuk menandai jawaban yang benar
        </p>
      </div>

      {error && (
        <p className="text-sm text-error bg-error-container/30 rounded-xl px-4 py-3">{error}</p>
      )}

      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Batal
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Menyimpan...' : 'Simpan Soal'}
        </Button>
      </div>
    </form>
  )
}
