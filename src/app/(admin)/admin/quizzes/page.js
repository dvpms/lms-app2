'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2, HelpCircle, CheckCircle } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'
import QuizForm from '@/components/features/admin/QuizForm'
import QuestionForm from '@/components/features/admin/QuestionForm'
import {
  useGetQuizzesQuery,
  useCreateQuizMutation,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
} from '@/lib/redux/api/quizzesApi'
import {
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} from '@/lib/redux/api/questionsApi'

export default function QuizzesPage() {
  const { data, isLoading, refetch } = useGetQuizzesQuery()
  const quizzes = data?.data ?? []

  const [createQuiz, { isLoading: creatingQuiz }] = useCreateQuizMutation()
  const [updateQuiz, { isLoading: updatingQuiz }] = useUpdateQuizMutation()
  const [deleteQuiz] = useDeleteQuizMutation()

  const [createQuestion, { isLoading: creatingQuestion }] = useCreateQuestionMutation()
  const [updateQuestion, { isLoading: updatingQuestion }] = useUpdateQuestionMutation()
  const [deleteQuestion] = useDeleteQuestionMutation()

  const [expandedQuizzes, setExpandedQuizzes] = useState({})
  const [quizModal, setQuizModal] = useState({ open: false, quiz: null })
  const [questionModal, setQuestionModal] = useState({ open: false, question: null, quizId: null })
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, type: null, id: null, name: '' })

  function toggleExpand(quizId) {
    setExpandedQuizzes((prev) => ({ ...prev, [quizId]: !prev[quizId] }))
  }

  async function handleQuizSubmit(form) {
    if (quizModal.quiz) {
      await updateQuiz({ id: quizModal.quiz.id, ...form })
    } else {
      await createQuiz(form)
    }
    setQuizModal({ open: false, quiz: null })
    refetch()
  }

  async function handleQuestionSubmit(form) {
    if (questionModal.question) {
      await updateQuestion({ id: questionModal.question.id, ...form })
    } else {
      await createQuestion(form)
    }
    setQuestionModal({ open: false, question: null, quizId: null })
    refetch()
  }

  async function handleDeleteConfirm() {
    if (deleteConfirm.type === 'quiz') {
      await deleteQuiz(deleteConfirm.id)
    } else {
      await deleteQuestion(deleteConfirm.id)
    }
    setDeleteConfirm({ open: false, type: null, id: null, name: '' })
    refetch()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Quizzes</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Kelola quiz dan soal-soal dalam satu tempat
          </p>
        </div>
        <Button
          onClick={() => setQuizModal({ open: true, quiz: null })}
          className="flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Quiz
        </Button>
      </div>

      {quizzes.length === 0 && (
        <Card>
          <div className="text-center py-12 text-on-surface-variant">
            <HelpCircle size={40} className="mx-auto mb-3 opacity-40" />
            <p className="font-semibold">Belum ada quiz</p>
            <p className="text-sm mt-1">Mulai dengan menambahkan quiz baru</p>
          </div>
        </Card>
      )}

      <div className="flex flex-col gap-4">
        {quizzes.map((quiz) => {
          const isExpanded = expandedQuizzes[quiz.id]
          const questions = quiz.questions ?? []

          return (
            <Card key={quiz.id}>
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-semibold text-on-surface text-lg">{quiz.title}</h2>
                    <Badge>{questions.length} soal</Badge>
                    {quiz.material && (
                      <span className="text-xs text-on-surface-variant bg-surface-container px-2 py-1 rounded-full">
                        {quiz.material.title}
                      </span>
                    )}
                    {quiz.subject && (
                      <span className="text-xs text-on-surface-variant bg-surface-container px-2 py-1 rounded-full">
                        {quiz.subject.title}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuizModal({ open: true, quiz })}
                  >
                    <Pencil size={15} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setDeleteConfirm({ open: true, type: 'quiz', id: quiz.id, name: quiz.title })
                    }
                  >
                    <Trash2 size={15} className="text-error" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => toggleExpand(quiz.id)}>
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </Button>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-outline-variant flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-on-surface-variant">
                      Daftar Soal
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center"
                      onClick={() =>
                        setQuestionModal({ open: true, question: null, quizId: quiz.id })
                      }
                    >
                      <Plus size={14} className="mr-1" />
                      Soal
                    </Button>
                  </div>

                  {questions.length === 0 && (
                    <p className="text-sm text-on-surface-variant text-center py-4">
                      Belum ada soal untuk quiz ini
                    </p>
                  )}

                  {questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="flex items-start gap-3 bg-surface-container-low rounded-xl px-4 py-3"
                    >
                      <span className="text-xs font-bold text-on-surface-variant w-6 text-center shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-on-surface text-sm">{question.text}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {question.options?.map((opt) => (
                            <span
                              key={opt.id}
                              className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                                opt.isCorrect
                                  ? 'bg-secondary-container text-on-secondary-container font-semibold'
                                  : 'bg-surface-container text-on-surface-variant'
                              }`}
                            >
                              {opt.isCorrect && <CheckCircle size={10} />}
                              {opt.text}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-on-surface-variant mt-1">{question.points} poin</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setQuestionModal({ open: true, question, quizId: quiz.id })
                          }
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setDeleteConfirm({
                              open: true,
                              type: 'question',
                              id: question.id,
                              name: question.text,
                            })
                          }
                        >
                          <Trash2 size={14} className="text-error" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {/* Quiz Modal */}
      <Modal
        isOpen={quizModal.open}
        onClose={() => setQuizModal({ open: false, quiz: null })}
        size="md"
      >
        <h2 className="text-lg font-semibold text-on-surface mb-4">
          {quizModal.quiz ? 'Edit Quiz' : 'Tambah Quiz'}
        </h2>
        <QuizForm
          initial={quizModal.quiz}
          onSubmit={handleQuizSubmit}
          onCancel={() => setQuizModal({ open: false, quiz: null })}
          isLoading={creatingQuiz || updatingQuiz}
        />
      </Modal>

      {/* Question Modal */}
      <Modal
        isOpen={questionModal.open}
        onClose={() => setQuestionModal({ open: false, question: null, quizId: null })}
        size="lg"
      >
        <h2 className="text-lg font-semibold text-on-surface mb-4">
          {questionModal.question ? 'Edit Soal' : 'Tambah Soal'}
        </h2>
        <QuestionForm
          quizId={questionModal.quizId}
          initial={questionModal.question}
          onSubmit={handleQuestionSubmit}
          onCancel={() => setQuestionModal({ open: false, question: null, quizId: null })}
          isLoading={creatingQuestion || updatingQuestion}
        />
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, type: null, id: null, name: '' })}
      >
        <h2 className="text-lg font-semibold text-on-surface mb-2">Konfirmasi Hapus</h2>
        <p className="text-on-surface-variant text-sm mb-6">
          Yakin ingin menghapus{' '}
          <span className="font-semibold text-on-surface">"{deleteConfirm.name}"</span>?
          {deleteConfirm.type === 'quiz' && (
            <span className="block mt-1 text-error">
              Semua soal dalam quiz ini juga akan terhapus.
            </span>
          )}
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="ghost"
            onClick={() => setDeleteConfirm({ open: false, type: null, id: null, name: '' })}
          >
            Batal
          </Button>
          <Button variant="secondary" onClick={handleDeleteConfirm}>
            Hapus
          </Button>
        </div>
      </Modal>
    </div>
  )
}
