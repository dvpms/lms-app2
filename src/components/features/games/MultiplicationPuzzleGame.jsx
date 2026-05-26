'use client'

import { useRef, useState } from 'react'
import {
  DndContext,
  useDroppable,
  useDraggable,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import { AnimatePresence, motion } from 'framer-motion'
import { gameSuccessVariants } from '@/lib/animations'
import { usePostActivityMutation } from '@/lib/redux/api/activityApi'
import clsx from 'clsx'

function DraggableTile({ id, value, used }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id })

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    touchAction: 'none',
    opacity: isDragging ? 0.3 : used ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={clsx(
        'size-12 flex items-center justify-center rounded-xl font-bold text-lg select-none transition-colors',
        used
          ? 'bg-surface-container text-on-surface-variant cursor-not-allowed'
          : 'bg-primary text-on-primary cursor-grab hover:shadow-[0_4px_12px_rgba(0,93,167,0.2)]',
      )}
    >
      {value}
    </div>
  )
}

function DroppableSlot({ id, value, isWrong }) {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <div
      ref={setNodeRef}
      className={clsx(
        'size-12 flex items-center justify-center rounded-xl border-2 font-bold text-lg transition-colors',
        isWrong
          ? 'bg-error-container text-on-error-container border-error'
          : value
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

/**
 * Evaluate equation like "4 * 3 = 12" or "_ * _ = 36".
 * Operator tokens are expected to already be arithmetic operators in game data.
 */
function checkCompletion(parts, blanks, slotValues) {
  const filledParts = parts.map((part, i) => {
    if (blanks.includes(i)) return slotValues[`slot-${i}`] ?? null
    return part
  })

  if (filledParts.some((p) => p === null)) return false

  try {
    const expr = filledParts.join(' ')
    const [lhs, rhs] = expr.split('=').map((s) => s.trim())
    // eslint-disable-next-line no-eval
    const lhsValue = Number(eval(lhs))
    const rhsValue = Number(rhs)

    if (!Number.isFinite(lhsValue) || !Number.isFinite(rhsValue)) return false
    return Math.abs(lhsValue - rhsValue) < 1e-9
  } catch {
    return false
  }
}

function allSlotsFilled(blanks, slotValues) {
  return blanks.every((i) => slotValues[`slot-${i}`] != null)
}

export default function MultiplicationPuzzleGame({ level, onComplete }) {
  const [slotValues, setSlotValues] = useState({})
  const [usedTileIds, setUsedTileIds] = useState([])
  const [completed, setCompleted] = useState(false)
  const [isWrong, setIsWrong] = useState(false)
  const [activeTile, setActiveTile] = useState(null)
  const [postActivity] = usePostActivityMutation()
  const awardingRef = useRef(false)
  const completedRef = useRef(false)
  completedRef.current = completed

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    }),
    useSensor(KeyboardSensor),
  )

  const equationParts = buildEquationParts(level.equation.parts, level.equation.blanks, slotValues)

  function handleDragStart(event) {
    const index = level.tiles.findIndex((_, i) => `tile-${i}` === event.active.id)
    if (index !== -1) {
      setActiveTile({ id: event.active.id, value: level.tiles[index] })
    }
  }

  async function awardPointsOnce() {
    if (completedRef.current || awardingRef.current) return
    awardingRef.current = true
    try {
      await postActivity({ type: 'GAME', activityId: level.id, points: level.points }).unwrap()
      completedRef.current = true
      setCompleted(true)
      onComplete?.()
    } catch {
      // If awarding fails, keep the level incomplete so the user can retry.
    } finally {
      awardingRef.current = false
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event
    setActiveTile(null)

    if (!over || !over.id.toString().startsWith('slot-')) return
    if (usedTileIds.includes(active.id)) return

    const tileIndex = level.tiles.findIndex((_, i) => `tile-${i}` === active.id)
    if (tileIndex === -1) return

    const tileValue = level.tiles[tileIndex]
    const slotId = over.id.toString()

    const updated = { ...slotValues, [slotId]: tileValue }
    const newUsed = [...usedTileIds, active.id]

    setSlotValues(updated)
    setUsedTileIds(newUsed)
    setIsWrong(false)

    // Only check completion when all slots are filled
    if (allSlotsFilled(level.equation.blanks, updated)) {
      const correct = checkCompletion(level.equation.parts, level.equation.blanks, updated)
      if (correct && !completed) {
        void awardPointsOnce()
      } else if (!correct) {
        // Show wrong feedback then reset after 1.5s
        setIsWrong(true)
        setTimeout(() => {
          setSlotValues({})
          setUsedTileIds([])
          setIsWrong(false)
        }, 1500)
      }
    }
  }

  function handleDragCancel() {
    setActiveTile(null)
  }

  return (
    <div className="flex flex-col gap-8 items-center">
      <p className="text-on-surface-variant text-sm text-center">
        Seret angka ke tempat yang kosong
      </p>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {/* Equation with droppable slots */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          {equationParts.map((part, i) =>
            part.type === 'slot' ? (
              <DroppableSlot key={part.id} id={part.id} value={part.value} isWrong={isWrong && part.value != null} />
            ) : (
              <span key={i} className="text-2xl font-bold text-on-surface">
                {part.value}
              </span>
            ),
          )}
        </div>

        {/* Draggable tiles */}
        <div className="flex gap-3 flex-wrap justify-center">
          {level.tiles.map((tile, i) => {
            const tileId = `tile-${i}`
            return (
              <DraggableTile
                key={tileId}
                id={tileId}
                value={tile}
                used={usedTileIds.includes(tileId)}
              />
            )
          })}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeTile ? (
            <div className="size-12 flex items-center justify-center rounded-xl font-bold text-lg bg-primary text-on-primary shadow-[0_8px_20px_rgba(0,93,167,0.25)] scale-110">
              {activeTile.value}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Wrong answer feedback */}
      <AnimatePresence>
        {isWrong && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-center bg-error-container text-on-error-container rounded-xl p-3 font-semibold text-sm w-full"
          >
            ❌ Jawaban salah, coba lagi!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Correct answer feedback */}
      <AnimatePresence>
        {completed && (
          <motion.div
            variants={gameSuccessVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="text-center bg-secondary-container text-on-secondary-container rounded-xl p-4 font-semibold w-full"
          >
            🎉 Benar! +{level.points} poin
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
