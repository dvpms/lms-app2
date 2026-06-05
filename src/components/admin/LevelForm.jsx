'use client'

import { useEffect, useState, useRef } from 'react'
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

// ---------------------------------------------
// Word Arrangement
// ---------------------------------------------

function WordArrangementLevelForm({ payloadJson, meta, onMetaChange, onPayloadChange }) {
  const initial = parsePayloadJson(payloadJson)
  
  const initialCorrectOrder = Array.isArray(initial.correctOrder) ? initial.correctOrder : []
  const initialWords = Array.isArray(initial.words) ? initial.words : []
  
  const initialSentence = initialCorrectOrder.join(' ')
  
  let remainingCorrect = [...initialCorrectOrder]
  const dists = []
  for (const w of initialWords) {
    const idx = remainingCorrect.indexOf(w)
    if (idx !== -1) {
      remainingCorrect.splice(idx, 1)
    } else {
      dists.push(w)
    }
  }
  
  const [sentence, setSentence] = useState(initialSentence)
  const [distractors, setDistractors] = useState(dists.join(', '))

  const lastEmittedRef = useRef(null)

  useEffect(() => {
    const next = parsePayloadJson(payloadJson)
    const asStr = JSON.stringify(next)
    if (asStr !== lastEmittedRef.current) {
      const nCorrectOrder = Array.isArray(next.correctOrder) ? next.correctOrder : []
      const nWords = Array.isArray(next.words) ? next.words : []
      setSentence(nCorrectOrder.join(' '))
      
      let rem = [...nCorrectOrder]
      const dst = []
      for (const w of nWords) {
        const idx = rem.indexOf(w)
        if (idx !== -1) rem.splice(idx, 1)
        else dst.push(w)
      }
      setDistractors(dst.join(', '))
    }
  }, [payloadJson])

  useEffect(() => {
    const correctOrder = sentence.trim().split(/\s+/).filter(Boolean)
    const distractorWords = distractors.split(',').map(s => s.trim()).filter(Boolean)
    const words = [...correctOrder, ...distractorWords]
    
    const payload = { words, correctOrder }
    const asString = JSON.stringify(payload)
    if (lastEmittedRef.current !== asString) {
      lastEmittedRef.current = asString
      onPayloadChange?.(payload)
    }
  }, [sentence, distractors, onPayloadChange])

  const correctWords = sentence.trim().split(/\s+/).filter(Boolean)
  const allWords = [...correctWords, ...distractors.split(',').map(s=>s.trim()).filter(Boolean)]

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border bg-surface-container-low p-4">
        <h3 className="font-semibold text-on-surface">Data Kalimat</h3>
        <p className="mt-1 text-sm text-on-surface-variant">Ketik kalimat yang benar. Sistem otomatis menyusunnya untuk permainan.</p>
        
        <div className="mt-4 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-on-surface-variant">Kalimat Benar</span>
            <textarea 
              value={sentence} 
              onChange={(e) => setSentence(e.target.value)} 
              className="rounded-xl border px-3 py-2 min-h-[80px]" 
              placeholder="Contoh: Saya suka belajar koding"
            />
          </label>
          
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-on-surface-variant">Kata Pengecoh (Opsional)</span>
            <span className="text-xs text-on-surface-variant -mt-1">Pisahkan dengan koma. Kata ini akan muncul sebagai opsi tapi bukan bagian jawaban yang benar.</span>
            <input 
              value={distractors} 
              onChange={(e) => setDistractors(e.target.value)} 
              className="rounded-xl border px-3 py-2" 
              placeholder="Contoh: tidur, malas"
            />
          </label>
        </div>
      </div>

      <div className="rounded-xl border bg-surface-container-low p-4">
        <h3 className="font-semibold text-on-surface">Preview</h3>
        <div className="mt-3">
          <p className="text-sm text-slate-500 mb-2">Urutan Benar:</p>
          <div className="flex flex-wrap gap-2">
            {correctWords.length === 0 ? <span className="text-sm text-slate-400">Belum ada kalimat</span> : correctWords.map((word, i) => (
               <span key={i} className="rounded-full bg-primary/10 text-primary px-3 py-1 text-sm font-medium">{word}</span>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-slate-500 mb-2">Semua Pilihan Kata (Akan diacak saat bermain):</p>
          <div className="flex flex-wrap gap-2">
            {allWords.length === 0 ? <span className="text-sm text-slate-400">Belum ada kata</span> : allWords.map((word, i) => (
               <span key={i} className="rounded-full border bg-white px-3 py-1 text-sm">{word}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------
// Word Puzzle
// ---------------------------------------------

function WordPuzzleLevelForm({ payloadJson, onPayloadChange }) {
  const initial = parsePayloadJson(payloadJson)

  function normalize(src) {
    const obj = src ?? {}
    const clues = Array.isArray(obj.clues) ? obj.clues : Array.isArray(obj.hints) ? obj.hints : []
    const answers = Array.isArray(obj.answers) ? obj.answers : Array.isArray(obj.hiddenWords) ? obj.hiddenWords : []
    const grid = Array.isArray(obj.grid) ? obj.grid : []
    return { clues, answers, grid }
  }

  const norm = normalize(initial)
  
  const initialItems = Math.max(norm.clues.length, norm.answers.length) > 0 
    ? Array.from({ length: Math.max(norm.clues.length, norm.answers.length) }).map((_, i) => ({
        clue: norm.clues[i] || '',
        answer: norm.answers[i] || ''
      }))
    : []

  const [items, setItems] = useState(initialItems)
  const [gridText, setGridText] = useState((norm.grid ?? []).map((row) => row.join('')).join('\n'))
  const [genStatus, setGenStatus] = useState(null)

  const lastEmittedRef = useRef(null)

  useEffect(() => {
    const next = parsePayloadJson(payloadJson)
    const asStr = JSON.stringify(next)
    if (asStr !== lastEmittedRef.current) {
      const n = normalize(next)
      const nextItems = Math.max(n.clues.length, n.answers.length) > 0 
        ? Array.from({ length: Math.max(n.clues.length, n.answers.length) }).map((_, i) => ({
            clue: n.clues[i] || '',
            answer: n.answers[i] || ''
          }))
        : []
      setItems(nextItems)
      setGridText((n.grid ?? []).map((row) => row.join('')).join('\n'))
    }
  }, [payloadJson])

  useEffect(() => {
    const clues = items.map(it => it.clue).filter(c => c.trim() !== '')
    const answers = items.map(it => it.answer).filter(a => a.trim() !== '')
    const grid = gridText.split('\n').map((row) => row.split('')).filter(row => row.length > 0 && row[0] !== '')
    
    const payload = { clues, answers, grid }
    const asString = JSON.stringify(payload)
    if (lastEmittedRef.current !== asString) {
      lastEmittedRef.current = asString
      onPayloadChange?.(payload)
    }
  }, [items, gridText, onPayloadChange])

  function addItem() {
    setItems(current => [...current, { clue: '', answer: '' }])
  }

  function removeItem(index) {
    setItems(current => current.filter((_, i) => i !== index))
  }

  function updateItem(index, field, value) {
    setItems(current => {
      const next = [...current]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  function handleGenerateGrid() {
    setGenStatus('generating')
    try {
      const answersList = items.map(it => it.answer).filter(Boolean).map(a => a.toUpperCase())
      if (answersList.length === 0) {
        setGenStatus('Isi minimal satu jawaban terlebih dahulu.')
        return
      }
      
      const result = generateGrid({ answers: answersList, options: { maxSize: 12, allowBackward: false } })
      if (result.success) {
        const rows = result.grid.map((row) => row.join(''))
        setGridText(rows.join('\n'))
        setGenStatus('ok')
      } else {
        setGenStatus(result.message || 'Gagal menghasilkan grid. Coba kata yang berbeda.')
      }
    } catch (err) {
      setGenStatus(err?.message ?? 'Terjadi kesalahan')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border bg-surface-container-low p-4">
        <h3 className="font-semibold text-on-surface">Daftar Kata & Petunjuk</h3>
        <p className="mt-1 text-sm text-on-surface-variant">Masukkan pasangan petunjuk (clue) dan jawaban. Grid akan otomatis menyesuaikan saat di-generate.</p>
        
        <div className="mt-4 flex flex-col gap-3">
          {items.map((item, index) => (
            <div key={index} className="flex gap-2 items-start rounded-xl border bg-white p-3">
              <div className="flex-1 grid gap-2">
                <input 
                  value={item.clue} 
                  onChange={(e) => updateItem(index, 'clue', e.target.value)} 
                  placeholder="Petunjuk (contoh: Hewan yang mengeong)" 
                  className="rounded-lg border px-3 py-2 text-sm" 
                />
                <input 
                  value={item.answer} 
                  onChange={(e) => updateItem(index, 'answer', e.target.value.toUpperCase())} 
                  placeholder="Jawaban (contoh: KUCING)" 
                  className="rounded-lg border px-3 py-2 text-sm font-semibold uppercase" 
                />
              </div>
              <button type="button" onClick={() => removeItem(index)} className="p-2 text-error hover:bg-error/10 rounded-lg">×</button>
            </div>
          ))}
          
          <button type="button" onClick={addItem} className="rounded-xl border border-dashed border-primary/50 py-3 text-sm font-medium text-primary hover:bg-primary/5">+ Tambah Pasangan Kata</button>
        </div>
      </div>

      <div className="rounded-xl border bg-surface-container-low p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-on-surface">Grid Puzzle</h3>
            <p className="text-sm text-on-surface-variant">Buat papan teka-teki dari jawaban di atas.</p>
          </div>
          <button type="button" onClick={handleGenerateGrid} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90">
            Generate Grid
          </button>
        </div>
        
        {gridText && (
          <div className="mt-4 rounded-xl border bg-white p-4 overflow-x-auto flex justify-center">
            <pre className="font-mono text-center tracking-[0.5em] text-lg leading-relaxed">{gridText}</pre>
          </div>
        )}
        
        {genStatus === 'generating' && <div className="mt-4 text-sm text-slate-500 font-medium">Menghasilkan grid...</div>}
        {genStatus && genStatus !== 'generating' && genStatus !== 'ok' && <div className="mt-4 text-sm text-error font-medium">{String(genStatus)}</div>}
      </div>
    </div>
  )
}

// ---------------------------------------------
// Multiplication
// ---------------------------------------------

function MultiplicationLevelForm({ payloadJson, onPayloadChange }) {
  const initial = parsePayloadJson(payloadJson)
  
  const initialParts = initial.equation?.parts ?? []
  const initialBlanks = initial.equation?.blanks ?? []
  
  const [equationText, setEquationText] = useState(initialParts.join(' '))
  const [blanks, setBlanks] = useState(initialBlanks)
  
  const correctAnswers = initialBlanks.map(i => initialParts[i]).filter(Boolean)
  const initialTiles = initial.tiles ?? []
  
  let rem = [...correctAnswers]
  const dists = []
  for (const t of initialTiles) {
    const idx = rem.indexOf(t)
    if (idx !== -1) rem.splice(idx, 1)
    else dists.push(t)
  }
  
  const [distractors, setDistractors] = useState(dists.join(', '))

  const lastEmittedRef = useRef(null)

  useEffect(() => {
    const next = parsePayloadJson(payloadJson)
    const asStr = JSON.stringify(next)
    if (asStr !== lastEmittedRef.current) {
      const nextParts = next.equation?.parts ?? []
      const nextBlanks = next.equation?.blanks ?? []
      setEquationText(nextParts.join(' '))
      setBlanks(nextBlanks)
      
      const nextCorrectAnswers = nextBlanks.map(i => nextParts[i]).filter(Boolean)
      const nextTiles = next.tiles ?? []
      let remAnswers = [...nextCorrectAnswers]
      const dst = []
      for (const t of nextTiles) {
        const idx = remAnswers.indexOf(t)
        if (idx !== -1) remAnswers.splice(idx, 1)
        else dst.push(t)
      }
      setDistractors(dst.join(', '))
    }
  }, [payloadJson])

  useEffect(() => {
    const parts = equationText.trim().split(/\s+/).filter(Boolean)
    const validBlanks = blanks.filter(i => i >= 0 && i < parts.length)
    
    const correctAns = validBlanks.map(i => parts[i])
    const dst = distractors.split(',').map(s => s.trim()).filter(Boolean)
    const tiles = [...correctAns, ...dst]
    
    const payload = {
      equation: { parts, blanks: validBlanks },
      tiles
    }
    
    const asStr = JSON.stringify(payload)
    if (lastEmittedRef.current !== asStr) {
      lastEmittedRef.current = asStr
      onPayloadChange?.(payload)
    }
  }, [equationText, blanks, distractors, onPayloadChange])

  const parts = equationText.trim().split(/\s+/).filter(Boolean)

  function toggleBlank(index) {
    setBlanks(current => 
      current.includes(index) 
        ? current.filter(i => i !== index)
        : [...current, index].sort((a, b) => a - b)
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border bg-surface-container-low p-4">
        <h3 className="font-semibold text-on-surface">Pengaturan Soal Matematika</h3>
        <p className="mt-1 text-sm text-on-surface-variant">Tulis persamaan lengkap, lalu klik bagian yang ingin dijadikan pertanyaan (dikosongkan).</p>
        
        <div className="mt-4 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-on-surface-variant">Persamaan Lengkap</span>
            <span className="text-xs text-on-surface-variant -mt-1">Gunakan spasi antar angka dan simbol (Contoh: 2 x 3 = 6)</span>
            <input 
              value={equationText} 
              onChange={(e) => {
                setEquationText(e.target.value)
                const newParts = e.target.value.trim().split(/\s+/).filter(Boolean)
                setBlanks(current => current.filter(i => i < newParts.length))
              }} 
              className="rounded-xl border px-3 py-2 font-mono text-lg tracking-wide" 
              placeholder="2 x 3 = 6"
            />
          </label>

          {parts.length > 0 && (
            <div className="grid gap-2">
              <span className="text-sm font-semibold text-on-surface-variant">Pilih Bagian yang Dikosongkan</span>
              <span className="text-xs text-on-surface-variant -mt-1">Klik kotak di bawah ini untuk menyembunyikannya (menjadi ?)</span>
              <div className="flex flex-wrap gap-2 p-3 bg-white rounded-xl border">
                {parts.map((part, i) => {
                  const isBlank = blanks.includes(i)
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleBlank(i)}
                      className={`min-w-12 h-12 px-3 rounded-lg text-lg font-bold flex items-center justify-center transition-colors ${
                        isBlank 
                          ? 'bg-primary border-primary text-white shadow-inner' 
                          : 'bg-surface-container-lowest border-outline-variant text-on-surface border hover:bg-surface-container-low'
                      }`}
                    >
                      {isBlank ? '?' : part}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-on-surface-variant">Angka Pengecoh (Opsional)</span>
            <span className="text-xs text-on-surface-variant -mt-1">Pisahkan dengan koma. Jawaban benar sudah otomatis masuk ke dalam pilihan tiles.</span>
            <input 
              value={distractors} 
              onChange={(e) => setDistractors(e.target.value)} 
              className="rounded-xl border px-3 py-2" 
              placeholder="Contoh: 4, 5, 8"
            />
          </label>
        </div>
      </div>
    </div>
  )
}
