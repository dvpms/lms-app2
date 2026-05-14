'use client'

import { useState } from 'react'
import { DndContext, useDroppable, useDraggable, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { AnimatePresence, motion } from 'framer-motion'
import { gameSuccessVariants } from '@/lib/animations'
import { usePostActivityMutation } from '@/lib/redux/api/activityApi'
import clsx from 'clsx'

function DraggableTile({ id, value, used }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id })
  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : {}

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={clsx(
        'size-12 flex items-center justify-center rounded-xl font-bold text-lg cursor-grab select-none transition-all',
        used
          ? 'bg-surface-container text-on-surface-variant opacity-40 cursor-not-allowed'
          : isDragging
            ? 'bg-primary text-on-primary shadow-[0_6px_16px_rgba(0,93,167,0.14)] z-50'
            : 'bg-primary text-on-primary hover:shadow-[0_4px_12px_rgba(0,93,167,0.08)]',
      )}
    >
      {value}
    </div>
  )
}

function DroppableSlot({ id, value }) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div
      ref={setNodeRef}
      className={clsx(
        'size-12 flex items-center justify-center rounded-xl border-2 font-bold text-lg transition-colors',
        value
          ? 'bg-secondary-container text-on-secondary-container border-secondary'
          : isOver
            ? 'border-primary bg-primary-fixed'
            : 'border-dashed border-outline-variant bg-surface-container',
      )}
    >
      {value ?? '?'}
    </div>
  )
}

function buildEquationParts(parts, blanks, slotValues) {
  return parts.map((part, i) => {
    if (blanks.includes(i)) {
      return { type: 'slot', id: `slot-${i}`, value: slotValues[`slot-${i}`] ?? null }
    }
    return { type: 'static', value: part }
  })
}

function checkCompletion(parts, blanks, slotValues, tiles) {
  const filledParts = parts.map((part, i) => {
    if (blanks.includes(i)) return slotValues[`slot-${i}`] ?? null
    return part
  })
  if (filledParts.some((p) => p === null)) return false

  try {
    const expr = filledParts.join(' ')
    const [lhs, , rhs] = expr.split('=').map((s) => s.trim())
    return eval(lhs) === Number(rhs)
  } catch {
    return false
  }
}

export default function MultiplicationPuzzleGame({ level, onComplete }) {
  const [slotValues, setSlotValues] = useState({})
  const [usedTiles, setUsedTiles] = useState([])
  const [completed, setCompleted] = useState(false)
  const [postActivity] = usePostActivityMutation()

  const sensors = useSensors(useSensor(PointerSensor))
  const equationParts = buildEquationParts(level.equation.parts, level.equation.blanks, slotValues)

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over || !over.id.toString().startsWith('slot-')) return

    const tileValue = active.id.toString().replace(/^tile-/, '')
    const slotId = over.id.toString()

    const updated = { ...slotValues, [slotId]: tileValue }
    setSlotValues(updated)
    setUsedTiles((prev) => [...prev.filter((t) => t !== active.id), active.id])

    if (checkCompletion(level.equation.parts, level.equation.blanks, updated, level.tiles) && !completed) {
      setCompleted(true)
      postActivity({ type: 'GAME', activityId: level.id, points: level.points })
      onComplete?.()
    }
  }

  return (
    <div className="flex flex-col gap-8 items-center">
      <p className="text-on-surface-variant text-sm">Seret angka ke tempat yang kosong</p>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {equationParts.map((part, i) =>
            part.type === 'slot' ? (
              <DroppableSlot key={part.id} id={part.id} value={part.value} />
            ) : (
              <span key={i} className="text-2xl font-bold text-on-surface">{part.value}</span>
            ),
          )}
        </div>

        <div className="flex gap-3 flex-wrap justify-center">
          {level.tiles.map((tile, i) => {
            const tileId = `tile-${tile}-${i}`
            return (
              <DraggableTile
                key={tileId}
                id={tileId}
                value={tile}
                used={usedTiles.includes(tileId)}
              />
            )
          })}
        </div>
      </DndContext>

      <AnimatePresence>
        {completed && (
          <motion.div
            variants={gameSuccessVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="text-center bg-secondary-container text-on-secondary-container rounded-xl p-4 font-semibold"
          >
            🎉 Benar! +{level.points} poin
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
