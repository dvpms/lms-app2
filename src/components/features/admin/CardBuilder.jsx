'use client'

import { useState } from 'react'
import { Trash2, Plus, GripVertical } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import RichTextEditor from '@/components/ui/RichTextEditor'
import ImageUpload from '@/components/features/admin/ImageUpload'

const CARD_TYPES = [
  { value: 'heading', label: 'Judul' },
  { value: 'text', label: 'Teks' },
  { value: 'image', label: 'Gambar' },
]

function CardItem({ card, index, onChange, onRemove, onMoveUp, onMoveDown, isFirst, isLast }) {
  function handleTypeChange(e) {
    onChange(index, { type: e.target.value, value: '' })
  }

  function handleValueChange(e) {
    onChange(index, { ...card, value: e.target.value })
  }

  function handleImageUpload(url) {
    onChange(index, { ...card, value: url })
  }

  return (
    <div className="flex gap-3 items-start bg-surface-container-low rounded-xl p-4 border border-outline-variant">
      <div className="flex flex-col gap-1 pt-1">
        <button
          type="button"
          onClick={() => onMoveUp(index)}
          disabled={isFirst}
          className="text-on-surface-variant hover:text-on-surface disabled:opacity-30 text-xs leading-none"
          aria-label="Pindah ke atas"
        >
          ▲
        </button>
        <GripVertical size={16} className="text-outline mx-auto" />
        <button
          type="button"
          onClick={() => onMoveDown(index)}
          disabled={isLast}
          className="text-on-surface-variant hover:text-on-surface disabled:opacity-30 text-xs leading-none"
          aria-label="Pindah ke bawah"
        >
          ▼
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-on-surface-variant w-16 shrink-0">
            Card {index + 1}
          </span>
          <select
            value={card.type}
            onChange={handleTypeChange}
            className="min-h-10 rounded-xl border-2 border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
          >
            {CARD_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {card.type === 'heading' && (
          <Input
            placeholder="Tulis judul..."
            value={card.value}
            onChange={handleValueChange}
          />
        )}

        {card.type === 'text' && (
          <RichTextEditor
            value={card.value}
            onChange={(html) => onChange(index, { ...card, value: html })}
          />
        )}

        {card.type === 'image' && (
          <ImageUpload
            currentUrl={card.value}
            onUpload={handleImageUpload}
            folder="ceriaedu/materials"
          />
        )}
      </div>

      <button
        type="button"
        onClick={() => onRemove(index)}
        className="text-error hover:text-on-error-container mt-1 shrink-0"
        aria-label="Hapus card"
      >
        <Trash2 size={18} />
      </button>
    </div>
  )
}

export default function CardBuilder({ value = [], onChange }) {
  function addCard() {
    onChange([...value, { type: 'text', value: '' }])
  }

  function updateCard(index, updated) {
    const next = value.map((c, i) => (i === index ? updated : c))
    onChange(next)
  }

  function removeCard(index) {
    onChange(value.filter((_, i) => i !== index))
  }

  function moveCard(index, direction) {
    const next = [...value]
    const target = index + direction
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-on-surface-variant">
          Konten Materi ({value.length} card)
        </label>
        <Button type="button" variant="ghost" size="sm" onClick={addCard}>
          <Plus size={16} className="mr-1" />
          Tambah Card
        </Button>
      </div>

      {value.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-outline-variant p-8 text-center text-on-surface-variant text-sm">
          Belum ada card. Klik "Tambah Card" untuk mulai.
        </div>
      )}

      <div className="flex flex-col gap-3">
        {value.map((card, index) => (
          <CardItem
            key={index}
            card={card}
            index={index}
            onChange={updateCard}
            onRemove={removeCard}
            onMoveUp={(i) => moveCard(i, -1)}
            onMoveDown={(i) => moveCard(i, 1)}
            isFirst={index === 0}
            isLast={index === value.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
