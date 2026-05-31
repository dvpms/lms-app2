'use client'

import { useRef, useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { AnimatePresence, motion } from 'framer-motion'
import { gameSuccessVariants } from '@/lib/animations'
import { usePostActivityMutation } from '@/lib/redux/api/activityApi'

function SortableWord({ id, word, isDragOverlay = false }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    touchAction: 'none',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`px-4 py-3 rounded-xl bg-primary text-on-primary font-semibold cursor-grab select-none min-h-[44px] flex items-center ${
        isDragOverlay ? 'shadow-[0_8px_20px_rgba(0,93,167,0.25)] scale-105' : ''
      }`}
    >
      {word}
    </div>
  )
}

function isCorrectOrder(words, correctOrder) {
  return words.every((w, i) => w === correctOrder[i])
}

export default function WordArrangementGame({ level, onComplete }) {
  const [words, setWords] = useState(() => {
    const shuffled = [...level.words].sort(() => Math.random() - 0.5)
    // Ensure shuffled is different from correct order
    while (isCorrectOrder(shuffled, level.correctOrder) && level.words.length > 1) {
      shuffled.sort(() => Math.random() - 0.5)
    }
    return shuffled
  })
  const [activeId, setActiveId] = useState(null)
  const [completed, setCompleted] = useState(false)
  const [postActivity] = usePostActivityMutation()
  const awardingRef = useRef(false)
  const completedRef = useRef(false)
  completedRef.current = completed

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // require 8px movement before drag starts — prevents accidental drags
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,    // 200ms hold before drag starts on touch
        tolerance: 8,  // allow 8px movement during delay
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function handleDragStart(event) {
    setActiveId(event.active.id)
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
    setActiveId(null)

    if (!over || active.id === over.id) return

    // Use the current `words` state to compute reordered array synchronously
    const oldIndex = words.indexOf(active.id)
    const newIndex = words.indexOf(over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(words, oldIndex, newIndex)
    setWords(reordered)

    if (isCorrectOrder(reordered, level.correctOrder)) {
      void awardPointsOnce()
    }
  }

  function handleDragCancel() {
    setActiveId(null)
  }

  const activeWord = activeId ? words.find((w) => w === activeId) : null

  return (
    <div className="flex flex-col gap-6 items-center">
      <p className="text-on-surface-variant text-sm text-center">
        Susun kata-kata berikut menjadi kalimat yang benar
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={words} strategy={rectSortingStrategy}>
          <div className="flex flex-wrap gap-3 justify-center p-4 min-h-16 rounded-xl bg-surface-container w-full">
            {words.map((word) => (
              <SortableWord key={word} id={word} word={word} />
            ))}
          </div>
        </SortableContext>

        <DragOverlay dropAnimation={null}>
          {activeWord ? (
            <SortableWord id={activeWord} word={activeWord} isDragOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>

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
