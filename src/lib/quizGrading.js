export function calculateQuizScore(questions, answers) {
  return questions.reduce((total, question) => {
    const selectedOptionId = answers?.[question.id]
    const correctOption = question.options.find((option) => option.isCorrect)
    if (correctOption && correctOption.id === selectedOptionId) {
      return total + question.points
    }
    return total
  }, 0)
}

export function buildQuizReviewDetails(questions, answers) {
  return questions.map((question) => {
    const selectedOptionId = answers?.[question.id] ?? null
    const selectedOption = question.options.find((option) => option.id === selectedOptionId) ?? null
    const correctOption = question.options.find((option) => option.isCorrect) ?? null
    const isCorrect = !!correctOption && correctOption.id === selectedOptionId

    return {
      questionId: question.id,
      questionText: question.text,
      points: question.points,
      selectedOptionId,
      selectedOptionText: selectedOption?.text ?? null,
      correctOptionId: correctOption?.id ?? null,
      correctOptionText: correctOption?.text ?? null,
      isCorrect,
      solutionImage: question.solutionImage ?? null,
    }
  })
}
