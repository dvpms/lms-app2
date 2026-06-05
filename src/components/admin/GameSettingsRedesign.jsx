import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Gamepad2,
  Layers3,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  MoreHorizontal,
  Puzzle,
  Calculator,
  GripVertical,
  Settings,
  BarChart3,
  ListChecks,
  BookOpen,
  ChevronDown,
} from 'lucide-react'

import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

function MetricCard({ icon: Icon, label, value }) {
  return (
    <Card className="rounded-3xl border-0 shadow-sm">
      <div className="flex items-center gap-4 p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-slate-500">{label}</p>
        </div>
      </div>
    </Card>
  )
}

function BadgeDifficulty({ difficulty }) {
  const style = {
    Easy: 'bg-emerald-50 text-emerald-700',
    Medium: 'bg-amber-50 text-amber-700',
    Hard: 'bg-red-50 text-red-700',
  }[difficulty]

  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${style}`}>{difficulty}</span>
}

export default function GameSettingsRedesign({ games = [], onEditLevel, onPreviewLevel, onDeleteLevel, onEditGame, onAddLevel }) {
  const [selectedGameId, setSelectedGameId] = useState(games[0]?.id ?? null)
  const [activeTab, setActiveTab] = useState('Levels')
  const [openedLevel, setOpenedLevel] = useState(games[0]?.levels?.[0]?.id ?? '')

  const selectedGame = useMemo(() => games.find((g) => g.id === selectedGameId) || games[0] || null, [games, selectedGameId])
  const totalLevels = useMemo(() => games.reduce((t, g) => t + (g.levels?.length ?? 0), 0), [games])
  const Icon = selectedGame?.icon || BookOpen

  function getLevelWords(level) {
    if (!level) return []
    // direct property
    if (Array.isArray(level.words)) return level.words

    const payload = level.payload ?? level.payloadJson ?? null
    if (!payload) return []

    const getFromObj = (obj) => {
      if (Array.isArray(obj.words) && obj.words.length > 0) return obj.words
      if (Array.isArray(obj.correctOrder) && obj.correctOrder.length > 0) return obj.correctOrder
      if (Array.isArray(obj.answers) && obj.answers.length > 0) return obj.answers
      if (Array.isArray(obj.hiddenWords) && obj.hiddenWords.length > 0) return obj.hiddenWords
      if (obj.equation?.parts && Array.isArray(obj.equation.parts) && obj.equation.parts.length > 0) return obj.equation.parts
      if (Array.isArray(obj.tiles) && obj.tiles.length > 0) return obj.tiles
      return []
    }

    // if payload already object
    if (typeof payload === 'object') {
      return getFromObj(payload)
    }

    // if payload is JSON string
    if (typeof payload === 'string') {
      try {
        const obj = JSON.parse(payload)
        return getFromObj(obj)
      } catch {
        return []
      }
    }

    return []
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-600">Game Management</p>
            <h1 className="text-3xl font-bold tracking-tight">Games Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">Kelola game, level, skor, dan pengaturan permainan dari satu tempat.</p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard icon={Gamepad2} label="Total Game" value={games.length} />
          <MetricCard icon={Layers3} label="Total Level" value={totalLevels} />
          <MetricCard icon={Eye} label="Preview Ready" value={3} />
          <MetricCard icon={BarChart3} label="Active Difficulty" value="Easy-Hard" />
        </section>

        <main className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <Card className="rounded-3xl border-0 shadow-sm">
            <div className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-bold">Game List</h2>
                  <p className="text-xs text-slate-500">Pilih game untuk dikelola</p>
                </div>
            
              </div>

              <div className="mb-4 flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2">
                <Search className="h-4 w-4 text-slate-400" />
                <input className="w-full bg-transparent text-sm outline-none" placeholder="Cari game..." />
              </div>

              <div className="space-y-3">
                {games.map((game) => {
                  const GameIcon = game.icon || BookOpen
                  const isActive = game.id === selectedGameId
                  return (
                    <button
                      key={game.id}
                      onClick={() => {
                        setSelectedGameId(game.id)
                        setOpenedLevel(game.levels?.[0]?.id ?? '')
                        setActiveTab('Levels')
                      }}
                      className={`w-full rounded-2xl border p-4 text-left transition ${isActive ? 'border-slate-300 bg-white shadow-sm' : 'border-transparent bg-slate-50 hover:bg-white'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${game.color}`}>
                          <GameIcon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold">{game.title}</h3>
                          <p className="truncate text-xs text-slate-500">{game.type}</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{(game.levels || []).length} level</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </Card>

          <section className="space-y-5">
            <Card className="overflow-hidden rounded-3xl border-0 shadow-sm">
              <div className="p-6">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-4">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-3xl border ${selectedGame?.color}`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h2 className="text-2xl font-bold">{selectedGame?.title}</h2>
                        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">{selectedGame?.type}</span>
                      </div>
                      <p className="max-w-2xl text-sm leading-6 text-slate-500">{selectedGame?.description}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center rounded-2xl" onClick={() => onEditGame?.(selectedGame)}><Edit3 className="mr-2 h-4 w-4" /> Edit</Button>
                    <Button variant="outline" size="icon" className="rounded-2xl"><MoreHorizontal className="h-4 w-4" /></Button>
                  </div>
                </div>

                <div className="flex gap-2 overflow-x-auto px-6 py-3">
                  {['Levels'].map((label, i) => {
                    const icons = [BarChart3, ListChecks, Settings]
                    const TabIcon = icons[i]
                    const isActive = activeTab === label
                    return (
                      <button key={label} onClick={() => setActiveTab(label)} className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${isActive ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
                        <TabIcon className="h-4 w-4" /> {label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </Card>

            {activeTab === 'Levels' && (
              <Card className="rounded-3xl border-0 shadow-sm">
                <div className="p-6">
                  <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-bold">Levels</h3>
                      <p className="text-sm text-slate-500">Gunakan accordion agar data level tidak memenuhi halaman.</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="rounded-2xl">Filter</Button>
                      <Button className="flex justify-center items-center rounded-2xl" onClick={() => onAddLevel?.(selectedGame)}><Plus className="mr-2 h-4 w-4" />  Level</Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {(selectedGame?.levels || []).map((level, index) => {
                      const isOpen = openedLevel === level.id
                      return (
                        <motion.div key={level.id} layout className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                          <button onClick={() => setOpenedLevel(isOpen ? '' : level.id)} className="flex w-full items-center gap-4 p-4 text-left">
                            <GripVertical className="h-5 w-5 text-slate-300" />
                            <div className={`h-10 w-1.5 rounded-full ${selectedGame?.accent}`} />
                            <div className="flex-1">
                              <h4 className="font-bold">{level.title}</h4>
                              <p className="text-xs text-slate-500">Urutan {index + 1} · Difficulty {level.difficulty} · {level.points} poin · {getLevelWords(level).length ?? 0} item</p>
                            </div>
                            <BadgeDifficulty difficulty={level.difficulty} />
                            <ChevronDown className={`h-5 w-5 text-slate-400 transition ${isOpen ? 'rotate-180' : ''}`} />
                          </button>

                          {isOpen && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="border-t bg-slate-50 p-4">
                              <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                                <div className="rounded-2xl bg-white p-4">
                                  <p className="mb-3 text-sm font-bold">Content Builder</p>
                                  <div className="flex flex-wrap gap-2">
                                    {getLevelWords(level).map((word, wIdx) => (
                                      <span key={`${word}-${wIdx}`} className="rounded-2xl border bg-slate-50 px-4 py-2 text-sm font-semibold">{word}</span>
                                    ))}
                                  </div>
                                  <p className="mt-4 text-xs leading-5 text-slate-500">Data utama ditampilkan sebagai form/chip agar lebih mudah dibaca. Raw JSON tetap bisa dibuka melalui tombol Advanced Editor.</p>
                                </div>

                                <div className="rounded-2xl bg-white p-4">
                                  <p className="mb-3 text-sm font-bold">Actions</p>
                                  <div className="grid gap-2">
                                    <Button variant="outline" className="justify-start flex items-center rounded-2xl" onClick={() => onEditLevel?.(selectedGame, level)}><Edit3 className="mr-2 h-4 w-4" /> Edit Level</Button>
                                    <Button variant="outline" className="justify-start flex items-center rounded-2xl text-red-600 hover:text-red-700" onClick={() => onDeleteLevel?.(level)}><Trash2 className="mr-2 h-4 w-4" /> Delete Level</Button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </Card>
            )}

          </section>
        </main>
      </div>
    </div>
  )
}

export function LevelEditorRedesign() {
  const [difficulty, setDifficulty] = useState('Easy')
  const [points, setPoints] = useState(20)
  const words = ['apel', 'adalah', 'buah', 'merah']

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-4xl">
        <Card className="overflow-hidden rounded-4xl border-0 shadow-xl shadow-slate-200/60">
          <div className="p-0">
            <div className="border-b bg-white px-8 py-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    <BookOpen className="h-3.5 w-3.5" /> Word Arrangement Builder
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight">Create New Level</h1>
                  <p className="mt-2 text-sm leading-6 text-slate-500">Buat level game dengan tampilan yang lebih mudah dipahami dibanding editor JSON.</p>
                </div>

                <Button variant="outline" className="rounded-2xl"><Eye className="mr-2 h-4 w-4" /> Preview</Button>
              </div>
            </div>

            <div className="space-y-8 bg-slate-50 p-8">
              {/* Basic Info */}
              <section className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><Settings className="h-5 w-5" /></div>
                  <div>
                    <h2 className="font-bold">Basic Information</h2>
                    <p className="text-sm text-slate-500">Informasi utama level permainan.</p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Nama Level</label>
                    <input defaultValue="Level 1 - Buah" className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm outline-none transition focus:border-slate-400 focus:bg-white" />
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-700">Difficulty</label>
                    <div className="flex gap-2">
                      {['Easy', 'Medium', 'Hard'].map((item) => (
                        <button key={item} onClick={() => setDifficulty(item)} className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-bold transition ${difficulty === item ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-700">Reward Points</label>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2">
                      <button onClick={() => setPoints((p) => Math.max(0, p - 5))} className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg font-bold">-</button>
                      <div className="flex-1 text-center text-xl font-bold">{points}</div>
                      <button onClick={() => setPoints((p) => p + 5)} className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white">+</button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Content Builder */}
              <section className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600"><Puzzle className="h-5 w-5" /></div>
                    <div>
                      <h2 className="font-bold">Content Builder</h2>
                      <p className="text-sm text-slate-500">Tambah kata dan susun urutan jawaban yang benar.</p>
                    </div>
                  </div>

                  <button className="text-sm font-semibold text-slate-500 hover:text-slate-900">Advanced JSON</button>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <label className="text-sm font-semibold text-slate-700">Words</label>
                      <Button size="sm" className="rounded-xl"><Plus className="mr-1 h-4 w-4" /> Add Word</Button>
                    </div>

                    <div className="flex flex-wrap gap-3 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-4">
                      {words.map((word) => (
                        <div key={word} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                          <GripVertical className="h-4 w-4 text-slate-300" />
                          <span className="text-sm font-semibold">{word}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-700">Correct Order</label>

                    <div className="space-y-2 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      {words.map((word, index) => (
                        <div key={word} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                          <GripVertical className="h-4 w-4 text-slate-300" />
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-600">{index + 1}</div>
                          <span className="font-semibold">{word}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Live Preview */}
              <section className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"><Eye className="h-5 w-5" /></div>
                  <div>
                    <h2 className="font-bold">Live Preview</h2>
                    <p className="text-sm text-slate-500">Preview realtime dari susunan kata yang dibuat.</p>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">Preview Sentence</p>
                      <h3 className="mt-1 text-2xl font-bold">apel adalah buah merah</h3>
                    </div>

                    <div className="rounded-2xl bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">+{points} Points</div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {words.map((word) => (
                      <div key={word} className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold shadow-sm">{word}</div>
                    ))}
                  </div>
                </div>
              </section>

              <div className="flex flex-col-reverse gap-3 pt-2 md:flex-row md:justify-end">
                <Button variant="outline" className="h-14 rounded-2xl px-8">Cancel</Button>
                <Button className="h-14 rounded-2xl px-8 text-base font-bold">Save Level</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
