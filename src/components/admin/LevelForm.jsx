'use client'

import { useEffect, useState, useRef } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { generateGrid } from '../../lib/wordPuzzleGenerator'

export default function LevelForm({ gameType, payloadJson, onPayloadChange, meta = {}, onMetaChange }) {
  if (gameType === 'word-arrangement') {
    return (
      <WordArrangementLevelForm
        payloadJson={payloadJson}
        meta={meta}
        onMetaChange={onMetaChange}
        onPayloadChange={onPayloadChange}
      />
    )
  }

  if (gameType === 'word-puzzle') {
    return (
      <WordPuzzleLevelForm
        payloadJson={payloadJson}
        onPayloadChange={onPayloadChange}
      />
    )
  }

  return (
    <MultiplicationLevelForm
      payloadJson={payloadJson}
      onPayloadChange={onPayloadChange}
    />
  )
}

function parsePayloadJson(payloadJson) {
  try {
    return JSON.parse(payloadJson ?? '{}')
  } catch {
    return {}
  }
}

function makeWordEntry(word, index) {
  return {
    id: `word-${index}-${Math.random().toString(36).slice(2, 8)}`,
    value: word,
  }
}

function buildWordState(payloadJson) {
  const initial = parsePayloadJson(payloadJson)
  const sourceWords = Array.isArray(initial.words) ? initial.words : []
  const entries = sourceWords.map((word, index) => makeWordEntry(word, index))
  const usedEntryIndexes = new Set()

  const orderIds = Array.isArray(initial.correctOrder) && initial.correctOrder.length > 0
    ? initial.correctOrder
      .map((word) => {
        const matchIndex = entries.findIndex((entry, index) => entry.value === word && !usedEntryIndexes.has(index))
        if (matchIndex === -1) return null
        usedEntryIndexes.add(matchIndex)
        return entries[matchIndex].id
      })
      .filter(Boolean)
    : entries.map((entry) => entry.id)

  return {
    words: entries,
    orderIds,
  }
}

function WordArrangementLevelForm({ payloadJson, meta, onMetaChange, onPayloadChange }) {
  const initialState = buildWordState(payloadJson)
  const [words, setWords] = useState(initialState.words)
  const [orderIds, setOrderIds] = useState(initialState.orderIds)
  const [draftWord, setDraftWord] = useState('')

  const levelName = meta.levelKey ?? ''
  const difficulty = meta.difficulty ?? 1
  const points = meta.points ?? 10

  useEffect(() => {
    onPayloadChange?.({
      words: words.map((entry) => entry.value),
      correctOrder: orderIds
        .map((id) => words.find((entry) => entry.id === id)?.value)
        .filter(Boolean),
    })
  }, [words, orderIds, onPayloadChange])

  function setMetaField(key, value) {
    onMetaChange?.({ ...meta, [key]: value })
  }

  function addWord(value) {
    const cleaned = value.trim()
    if (!cleaned) return
    const nextEntry = makeWordEntry(cleaned, words.length)
    setWords((current) => [...current, nextEntry])
    setOrderIds((current) => [...current, nextEntry.id])
  }

  function removeWord(id) {
    setWords((current) => current.filter((entry) => entry.id !== id))
    setOrderIds((current) => current.filter((itemId) => itemId !== id))
  }

  function moveOrder(fromIndex, toIndex) {
    setOrderIds((current) => arrayMove(current, fromIndex, toIndex))
  }

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = orderIds.indexOf(active.id)
    const newIndex = orderIds.indexOf(over.id)
    if (oldIndex === -1 || newIndex === -1) return
    moveOrder(oldIndex, newIndex)
  }

  const orderedWords = orderIds.map((id) => words.find((entry) => entry.id === id)?.value).filter(Boolean)

  function SortableWord({ id, value, index }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
    return (
      <div
        ref={setNodeRef}
        style={{ transform: CSS.Translate.toString(transform), transition, opacity: isDragging ? 0.6 : 1 }}
        {...attributes}
        className="flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2"
      >
        <button type="button" {...listeners} className="cursor-grab text-sm text-on-surface-variant">☰</button>
        <div className="flex-1 font-medium text-on-surface">{value}</div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => index > 0 && moveOrder(index, index - 1)} className="rounded-md border px-2 py-1 text-xs">↑</button>
          <button type="button" onClick={() => index < orderIds.length - 1 && moveOrder(index, index + 1)} className="rounded-md border px-2 py-1 text-xs">↓</button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border bg-surface-container-low p-4">
        <h3 className="font-semibold text-on-surface">Basic Info</h3>
        <div className="mt-4 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm text-on-surface-variant">Nama Level</span>
            <input value={levelName} onChange={(e) => setMetaField('levelKey', e.target.value)} className="rounded-xl border px-3 py-2" />
          </label>
          <div className="grid gap-2">
            <span className="text-sm text-on-surface-variant">Tingkat Kesulitan</span>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Easy', value: 1 },
                { label: 'Medium', value: 2 },
                { label: 'Hard', value: 3 },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setMetaField('difficulty', item.value)}
                  className={`rounded-full border px-4 py-2 text-sm ${difficulty === item.value ? 'bg-primary text-white' : 'bg-white text-on-surface'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <span className="text-sm text-on-surface-variant">Poin Hadiah</span>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setMetaField('points', Math.max(0, points - 1))} className="rounded-full border px-3 py-2">-</button>
              <div className="min-w-12 text-center font-semibold">{points}</div>
              <button type="button" onClick={() => setMetaField('points', points + 1)} className="rounded-full border px-3 py-2">+</button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-surface-container-low p-4">
        <h3 className="font-semibold text-on-surface">Kata</h3>
        <p className="mt-1 text-sm text-on-surface-variant">Tambahkan kata satu per satu. Admin tidak perlu memikirkan format data.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {words.map((entry) => (
            <div key={entry.id} className="flex items-center gap-2 rounded-full border bg-white px-3 py-2 text-sm">
              <span>{entry.value}</span>
              <button type="button" onClick={() => removeWord(entry.id)} className="text-error">×</button>
            </div>
          ))}
          <div className="flex items-center gap-2 rounded-full border border-dashed px-3 py-2">
            <input value={draftWord} onChange={(e) => setDraftWord(e.target.value)} placeholder="Tambah kata" className="min-w-36 bg-transparent outline-none" />
            <button type="button" onClick={() => { addWord(draftWord); setDraftWord('') }} className="rounded-full bg-primary px-3 py-1 text-sm text-white">+ Tambah</button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-surface-container-low p-4">
        <h3 className="font-semibold text-on-surface">Urutan Benar</h3>
        <p className="mt-1 text-sm text-on-surface-variant">Seret untuk mengubah urutan, atau pakai tombol kecil di tiap item.</p>
        <div className="mt-4">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={orderIds} strategy={rectSortingStrategy}>
              <div className="flex flex-col gap-2">
                {orderIds.map((id, index) => {
                  const value = words.find((entry) => entry.id === id)?.value ?? ''
                  return <SortableWord key={id} id={id} index={index} value={value} />
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>

      <div className="rounded-xl border bg-surface-container-low p-4">
        <h3 className="font-semibold text-on-surface">Preview</h3>
        <div className="mt-3 rounded-xl border bg-white px-4 py-3 text-sm text-on-surface shadow-sm">
          {orderedWords.join(' ') || 'Preview akan muncul di sini'}
        </div>
      </div>
    </div>
  )
}

function WordPuzzleLevelForm({ payloadJson, onPayloadChange }) {
  const initial = parsePayloadJson(payloadJson)

  // Normalize payload to shape: { clues: string[], answers: string[], grid?: string[][] }
  function normalize(src) {
    const obj = src ?? {}
    const clues = Array.isArray(obj.clues) ? obj.clues : Array.isArray(obj.hints) ? obj.hints : []
    const answers = Array.isArray(obj.answers) ? obj.answers : Array.isArray(obj.hiddenWords) ? obj.hiddenWords : []
    const grid = Array.isArray(obj.grid) ? obj.grid : []
    return { clues, answers, grid }
  }

  const norm = normalize(initial)
  const [clues, setClues] = useState(norm.clues)
  const [answers, setAnswers] = useState(norm.answers)
  const [gridText, setGridText] = useState((norm.grid ?? []).map((row) => row.join('')).join('\n'))
  const [gridMaxSize, setGridMaxSize] = useState(12)
  const [allowBackward, setAllowBackward] = useState(false)
  const [genStatus, setGenStatus] = useState(null)

  // keep a ref of last emitted payload string to avoid echo loop
  const lastEmittedRef = useRef(null)

  useEffect(() => {
    const next = parsePayloadJson(payloadJson)
    const n = normalize(next)
    setClues(n.clues)
    setAnswers(n.answers)
    setGridText((n.grid ?? []).map((row) => row.join('')).join('\n'))
  }, [payloadJson])

  useEffect(() => {
    const grid = gridText.split('\n').map((row) => row.split(''))
    const payload = { clues, answers, grid }
    const asString = JSON.stringify(payload)
    if (lastEmittedRef.current !== asString) {
      lastEmittedRef.current = asString
      onPayloadChange?.(payload)
    }
  }, [clues, answers, gridText, onPayloadChange])

  function addClue(text) {
    const v = (text ?? '').trim()
    if (!v) return
    setClues((c) => [...c, v])
  }

  function removeClue(index) {
    setClues((c) => c.filter((_, i) => i !== index))
  }

  function addAnswer(text) {
    const v = (text ?? '').trim()
    if (!v) return
    setAnswers((a) => [...a, v])
  }

  function removeAnswer(index) {
    setAnswers((a) => a.filter((_, i) => i !== index))
  }

  const [draftClue, setDraftClue] = useState('')
  const [draftAnswer, setDraftAnswer] = useState('')

  function renderMask(answer) {
    return answer.replace(/./g, '•')
  }

  function handleGenerateGrid() {
    setGenStatus('generating')
    try {
      const result = generateGrid({ answers, options: { maxSize: Number(gridMaxSize) || 12, allowBackward } })
      if (result.success) {
        const rows = result.grid.map((row) => row.join(''))
        setGridText(rows.join('\n'))
        setGenStatus('ok')
      } else {
        setGenStatus(result.message || 'failed')
      }
    } catch (err) {
      setGenStatus(err?.message ?? 'error')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border bg-surface-container-low p-4">
        <h3 className="font-semibold text-on-surface">Content Builder</h3>
        <p className="mt-1 text-sm text-on-surface-variant">Tambah petunjuk (clues) dan jawaban (answers) untuk teka-teki kata.</p>

        <div className="mt-4 grid gap-4">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-on-surface-variant">Clues (petunjuk)</label>
              <div className="flex items-center gap-2">
                <input value={draftClue} onChange={(e) => setDraftClue(e.target.value)} placeholder="Tambah petunjuk" className="rounded-xl border px-3 py-1" />
                <button type="button" onClick={() => { addClue(draftClue); setDraftClue('') }} className="rounded-xl bg-primary px-3 py-1 text-white">Tambah</button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {clues.map((c, i) => (
                <div key={`${c}-${i}`} className="flex items-center gap-2 rounded-full border bg-white px-3 py-2 text-sm">
                  <span>{c}</span>
                  <button type="button" onClick={() => removeClue(i)} className="text-error">×</button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-on-surface-variant">Answers (jawaban)</label>
              <div className="flex items-center gap-2">
                <input value={draftAnswer} onChange={(e) => setDraftAnswer(e.target.value)} placeholder="Tambah jawaban" className="rounded-xl border px-3 py-1" />
                <button type="button" onClick={() => { addAnswer(draftAnswer); setDraftAnswer('') }} className="rounded-xl bg-primary px-3 py-1 text-white">Tambah</button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {answers.map((a, i) => (
                <div key={`${a}-${i}`} className="flex items-center gap-2 rounded-full border bg-white px-3 py-2 text-sm">
                  <span>{a}</span>
                  <button type="button" onClick={() => removeAnswer(i)} className="text-error">×</button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-on-surface-variant">Grid (opsional, baris baru = baris)</label>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm">
                  <span>Max</span>
                  <input type="number" min={5} max={30} value={gridMaxSize} onChange={(e) => setGridMaxSize(Number(e.target.value))} className="w-16 rounded-xl border px-2 py-1" />
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={allowBackward} onChange={(e) => setAllowBackward(e.target.checked)} />
                  <span>Allow Backward</span>
                </label>
                <button type="button" onClick={handleGenerateGrid} className="rounded-xl bg-primary px-3 py-1 text-white">Generate Grid</button>
              </div>
            </div>
            <label className="flex flex-col gap-2">
              <textarea value={gridText} onChange={(e) => setGridText(e.target.value)} rows={4} className="rounded-xl border px-3 py-2 font-mono" />
            </label>
            {genStatus === 'generating' && <div className="mt-2 text-sm text-slate-500">Menghasilkan...</div>}
            {genStatus && genStatus !== 'generating' && genStatus !== 'ok' && <div className="mt-2 text-sm text-error">{String(genStatus)}</div>}
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-surface-container-low p-4">
        <h3 className="font-semibold text-on-surface">Preview</h3>
        <div className="mt-3 rounded-xl border bg-white px-4 py-3 text-sm text-on-surface shadow-sm">
          <p className="font-medium">Contoh petunjuk</p>
          <ul className="mt-2 list-disc pl-5">
            {clues.length === 0 ? <li className="text-slate-500">Belum ada petunjuk</li> : clues.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
          <div className="mt-3">
            <p className="text-sm text-slate-500">Jawaban (tersembunyi)</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {answers.length === 0 ? <div className="text-slate-500">Belum ada jawaban</div> : answers.map((a, i) => <div key={i} className="rounded-2xl bg-slate-50 px-3 py-1 text-sm font-semibold">{renderMask(a)}</div>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MultiplicationLevelForm({ payloadJson, onPayloadChange }) {
  const initial = parsePayloadJson(payloadJson)
  const [payloadObj, setPayloadObj] = useState(initial)

  useEffect(() => {
    const next = parsePayloadJson(payloadJson)
    setPayloadObj(next)
  }, [payloadJson])

  useEffect(() => {
    onPayloadChange?.(payloadObj)
  }, [payloadObj, onPayloadChange])

  const eqParts = (payloadObj.equation?.parts ?? []).join(' ')
  const blanks = (payloadObj.equation?.blanks ?? []).join(', ')
  const tiles = (payloadObj.tiles ?? []).join(', ')

  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-on-surface-variant">Persamaan (gunakan spasi untuk pemisah token)</span>
        <input value={eqParts} onChange={(e) => setPayloadObj((current) => ({ ...current, equation: { ...(current.equation ?? {}), parts: e.target.value.split(' ').filter(Boolean) } }))} className="rounded-xl border px-3 py-2 font-mono" />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-on-surface-variant">Index blank (pisah koma, contoh: 0,2)</span>
        <input value={blanks} onChange={(e) => setPayloadObj((current) => ({ ...current, equation: { ...(current.equation ?? {}), blanks: e.target.value.split(',').map((item) => Number(item.trim())).filter((value) => Number.isInteger(value)) } }))} className="rounded-xl border px-3 py-2" />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-on-surface-variant">Tiles (pisah koma)</span>
        <input value={tiles} onChange={(e) => setPayloadObj((current) => ({ ...current, tiles: e.target.value.split(',').map((item) => item.trim()).filter(Boolean) }))} className="rounded-xl border px-3 py-2" />
      </label>
    </div>
  )
}
