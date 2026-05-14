'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { AnimatePresence, motion } from 'framer-motion'
import { gameSuccessVariants } from '@/lib/animations'
import { usePostActivityMutation } from '@/lib/redux/api/activityApi'

function SortableWord({ id, word }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className={`px-4 py-2 rounded-xl bg-primary text-on-primary font-semibold cursor-grab select-none transition-shadow ${
        isDragging ? 'shadow-[0_6px_16px_rgba(0,93,167,0.14)] opacity-80' : ''
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
  const [words, setWords] = useState(() => [...level.words].sort(() => Math.random() - 0.5))
  const [completed, setCompleted] = useState(false)
  const [postActivity] = usePostActivityMutation()

  const sensors = useSensors(useSensor(PointerSensor))

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setWords((prev) => {
      const oldIndex = prev.indexOf(active.id)
      const newIndex = prev.indexOf(over.id)
      const reordered = arrayMove(prev, oldIndex, newIndex)

      if (isCorrectOrder(reordered, level.correctOrder) && !completed) {
        setCompleted(true)
        postActivity({ type: 'GAME', activityId: level.id, points: level.points })
        onComplete?.()
      }
      return reordered
    })
  }

  return (
    <div className="flex flex-col gap-6 items-center">
      <p className="text-on-surface-variant text-sm">Susun kata-kata berikut menjadi kalimat yang benar</p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={words} strategy={horizontalListSortingStrategy}>
          <div className="flex flex-wrap gap-3 justify-center p-4 min-h-16 rounded-xl bg-surface-container">
            {words.map((word) => (
              <SortableWord key={word} id={word} word={word} />
            ))}
          </div>
        </SortableContext>
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
