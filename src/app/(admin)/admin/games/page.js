'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'
import LevelForm from '@/components/admin/LevelForm'
import GameSettingsRedesign from '@/components/admin/GameSettingsRedesign'
import { Plus, Pencil, Trash2, Gamepad2, Layers3 } from 'lucide-react'

const EMPTY_GAME = { type: '', title: '', description: '', emoji: '🎮' }
const EMPTY_LEVEL = { levelKey: '', order: 1, difficulty: 1, points: 10, payload: '{}' }

function parsePayload(raw) {
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function stringifyPayload(value) {
  try {
    return JSON.stringify(value ?? {}, null, 2)
  } catch {
    return '{}'
  }
}

function StatCard({ label, value, icon }) {
  return (
    <Card className="flex items-center gap-4">
      <div className="size-12 rounded-xl bg-surface-container-low flex items-center justify-center">{icon}</div>
      <div>
        <p className="text-2xl font-bold text-on-surface">{value}</p>
        <p className="text-sm text-on-surface-variant">{label}</p>
      </div>
    </Card>
  )
}

export default function AdminGamesPage() {
  const [games, setGames] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [gameModal, setGameModal] = useState({ open: false, game: null })
  const [levelModal, setLevelModal] = useState({ open: false, game: null, level: null })
  const [deleteState, setDeleteState] = useState({ open: false, type: null, target: null })
  const [gameForm, setGameForm] = useState(EMPTY_GAME)
  const [levelForm, setLevelForm] = useState(EMPTY_LEVEL)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function fetchGames() {
    try {
      setIsLoading(true)
      setIsError(false)
      const res = await fetch('/api/admin/games')
      const json = await res.json()
      if (!res.ok) {
        setIsError(true)
        return
      }
      setGames(json.data ?? [])
    } catch {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGames()
  }, [])

  const stats = useMemo(() => {
    const totalGames = games.length
    const totalLevels = games.reduce((sum, game) => sum + (game.levels?.length ?? 0), 0)
    return { totalGames, totalLevels }
  }, [games])

  function openGameModal(game = null) {
    setGameForm(game ? {
      type: game.type,
      title: game.title,
      description: game.description,
      emoji: game.emoji,
    } : EMPTY_GAME)
    setGameModal({ open: true, game })
  }

  function openLevelModal(game, level = null) {
    setLevelForm(level ? {
      levelKey: level.levelKey,
      order: level.order,
      difficulty: level.difficulty,
      points: level.points,
      payload: stringifyPayload(level.payload),
    } : EMPTY_LEVEL)
    setLevelModal({ open: true, game, level })
  }

  async function saveGame() {
    setIsSubmitting(true)
    try {
      const url = gameModal.game ? `/api/admin/games/${gameModal.game.id}` : '/api/admin/games'
      const method = gameModal.game ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameForm),
      })
      if (!res.ok) return
      setGameModal({ open: false, game: null })
      await fetchGames()
    } finally {
      setIsSubmitting(false)
    }
  }

  async function saveLevel() {
    const payload = parsePayload(levelForm.payload)
    if (payload == null) return

    setIsSubmitting(true)
    try {
      const url = levelModal.level
        ? `/api/admin/game-levels/${levelModal.level.id}`
        : `/api/admin/games/${levelModal.game.id}/levels`
      const method = levelModal.level ? 'PUT' : 'POST'
      const body = {
        ...levelForm,
        order: Number(levelForm.order),
        difficulty: Number(levelForm.difficulty),
        points: Number(levelForm.points),
        payload,
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) return
      setLevelModal({ open: false, game: null, level: null })
      await fetchGames()
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete() {
    setIsSubmitting(true)
    try {
      const url = deleteState.type === 'game'
        ? `/api/admin/games/${deleteState.target.id}`
        : `/api/admin/game-levels/${deleteState.target.id}`
      const res = await fetch(url, { method: 'DELETE' })
      if (!res.ok) return
      setDeleteState({ open: false, type: null, target: null })
      await fetchGames()
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Spinner />
      </div>
    )
  }

  if (isError) {
    return <p className="text-error text-center p-6">Gagal memuat data game.</p>
  }

  return (
    <>
      <GameSettingsRedesign
        games={games}
        onEditLevel={(game, level) => openLevelModal(game, level)}
        onPreviewLevel={(level) => {/* preview handler can be added */}}
        onDeleteLevel={(level) => setDeleteState({ open: true, type: 'level', target: level })}
        onEditGame={(game) => openGameModal(game)}
        onAddLevel={(game) => openLevelModal(game)}
      />

      <Modal isOpen={gameModal.open} onClose={() => setGameModal({ open: false, game: null })} size="md">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-on-surface">{gameModal.game ? 'Edit Game' : ' Tambah Game'}</h2>
          {['type', 'title', 'description', 'emoji'].map((field) => (
            <label key={field} className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-on-surface-variant">{field}</span>
              <input
                value={gameForm[field]}
                onChange={(e) => setGameForm((prev) => ({ ...prev, [field]: e.target.value }))}
                className="min-h-12 rounded-xl border-2 border-outline-variant bg-surface-container-lowest px-4 py-3 text-on-surface focus:border-primary focus:outline-none"
              />
            </label>
          ))}
          <div className="flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={() => setGameModal({ open: false, game: null })}>Batal</Button>
            <Button onClick={saveGame} disabled={isSubmitting}>Simpan</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={levelModal.open} onClose={() => setLevelModal({ open: false, game: null, level: null })} size="lg">
        <LevelModalContent
          levelModal={levelModal}
          levelForm={levelForm}
          setLevelForm={setLevelForm}
          setLevelModal={setLevelModal}
          isSubmitting={isSubmitting}
          saveLevel={saveLevel}
        />
      </Modal>

      <Modal isOpen={deleteState.open} onClose={() => setDeleteState({ open: false, type: null, target: null })}>
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-on-surface">Konfirmasi Hapus</h2>
          <p className="text-sm text-on-surface-variant">Yakin ingin menghapus item ini? Aksi ini tidak bisa dibatalkan.</p>
          <div className="flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={() => setDeleteState({ open: false, type: null, target: null })}>Batal</Button>
            <Button variant="secondary" onClick={handleDelete} disabled={isSubmitting}>Hapus</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

function LevelModalContent({ levelModal, levelForm, setLevelForm, setLevelModal, isSubmitting, saveLevel }) {
  const [advanced, setAdvanced] = useState(false)
  const gameType = levelModal.game?.type ?? 'word-arrangement'
  const handleMetaChange = useCallback((m) => setLevelForm((prev) => ({ ...prev, levelKey: m.levelKey, order: m.order ?? prev.order, difficulty: m.difficulty ?? prev.difficulty, points: m.points ?? prev.points })), [setLevelForm])

  const handlePayloadChange = useCallback((obj) => {
    setLevelForm((prev) => ({ ...prev, payload: JSON.stringify(obj ?? {}, null, 2) }))
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-on-surface">{levelModal.level ? 'Edit Level' : 'Tambah Level'}</h2>

      <div className="rounded-xl border bg-surface-container-low p-4">
        <h3 className="font-semibold text-on-surface">Info Dasar</h3>
        <div className="mt-4 grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-on-surface-variant">Nama Level</span>
              <input value={levelForm.levelKey} onChange={(e) => setLevelForm(p => ({...p, levelKey: e.target.value}))} className="rounded-xl border-2 border-outline-variant px-3 py-2 focus:border-primary focus:outline-none" placeholder="Contoh: Level 1" />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-on-surface-variant">Urutan Level</span>
              <input type="number" value={levelForm.order} onChange={(e) => setLevelForm(p => ({...p, order: e.target.value}))} className="rounded-xl border-2 border-outline-variant px-3 py-2 focus:border-primary focus:outline-none" />
            </label>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <span className="text-sm font-medium text-on-surface-variant">Tingkat Kesulitan</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Mudah', value: 1 },
                  { label: 'Sedang', value: 2 },
                  { label: 'Sulit', value: 3 },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setLevelForm(p => ({...p, difficulty: item.value}))}
                    className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors ${Number(levelForm.difficulty) === item.value ? 'border-primary bg-primary text-white' : 'border-outline-variant bg-surface-container-lowest text-on-surface'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid gap-2">
              <span className="text-sm font-medium text-on-surface-variant">Poin Hadiah</span>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setLevelForm(p => ({...p, points: Math.max(0, Number(p.points) - 1)}))} className="rounded-full border-2 border-outline-variant px-3 py-1 hover:bg-surface-container-lowest">-</button>
                <div className="min-w-8 text-center font-semibold">{levelForm.points}</div>
                <button type="button" onClick={() => setLevelForm(p => ({...p, points: Number(p.points) + 1}))} className="rounded-full border-2 border-outline-variant px-3 py-1 hover:bg-surface-container-lowest">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-on-surface-variant">Editor payload terstruktur</p>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={advanced} onChange={(e) => setAdvanced(e.target.checked)} /> Advanced (JSON)
        </label>
      </div>

      {!advanced ? (
        <LevelForm
          key={levelModal.level?.id ?? levelModal.game?.id ?? 'new-level'}
          gameType={gameType}
          payloadJson={levelForm.payload}
          onPayloadChange={handlePayloadChange}
          meta={{ levelKey: levelForm.levelKey, order: levelForm.order, difficulty: Number(levelForm.difficulty), points: Number(levelForm.points) }}
          onMetaChange={handleMetaChange}
        />
      ) : (
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-on-surface-variant">payload JSON</span>
          <textarea
            value={levelForm.payload}
            onChange={(e) => setLevelForm((prev) => ({ ...prev, payload: e.target.value }))}
            rows={10}
            className="w-full rounded-xl border-2 border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm text-on-surface font-mono focus:border-primary focus:outline-none"
          />
        </label>
      )}

      <div className="flex items-center justify-end gap-3">
        <Button variant="ghost" onClick={() => setLevelModal({ open: false, game: null, level: null })}>Batal</Button>
        <Button onClick={saveLevel} disabled={isSubmitting}>Simpan</Button>
      </div>
    </div>
  )
}