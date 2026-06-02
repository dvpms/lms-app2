import { PrismaClient } from '../src/generated/prisma/client.ts'
import { PrismaNeon } from '@prisma/adapter-neon'
import bcrypt from 'bcryptjs'
import { seedGames } from './seed-games.js'

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })
async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@ceriaedu.id' },
    update: {},
    create: {
      name: 'Admin CeriaEdu',
      email: 'admin@ceriaedu.id',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  const studentPassword = await bcrypt.hash('student123', 10)
  await prisma.user.upsert({
    where: { email: 'siswa@ceriaedu.id' },
    update: {},
    create: {
      name: 'Budi Santoso',
      email: 'siswa@ceriaedu.id',
      password: studentPassword,
      role: 'STUDENT',
    },
  })

  const math = await prisma.subject.upsert({
    where: { id: 'subject-math' },
    update: {},
    create: {
      id: 'subject-math',
      title: 'Matematika',
      activitiesDescription: 'Belajar perkalian, pembagian, dan soal cerita',
      icon: 'calculator',
    },
  })

  const english = await prisma.subject.upsert({
    where: { id: 'subject-english' },
    update: {},
    create: {
      id: 'subject-english',
      title: 'Bahasa Inggris',
      activitiesDescription: 'Belajar kosakata, kalimat, dan percakapan',
      icon: 'book-open',
    },
  })

  const mathMaterial1 = await prisma.material.upsert({
    where: { id: 'material-math-1' },
    update: {},
    create: {
      id: 'material-math-1',
      subjectId: math.id,
      title: 'Perkalian Dasar',
      order: 1,
      cards: [
        { type: 'heading', value: 'Perkalian Dasar' },
        { type: 'text', value: 'Perkalian adalah penjumlahan berulang. Contoh: 3 × 4 = 3 + 3 + 3 + 3 = 12' },
        { type: 'text', value: 'Tabel perkalian 1–5 sangat penting untuk dikuasai.' },
      ],
    },
  })

  const mathMaterial2 = await prisma.material.upsert({
    where: { id: 'material-math-2' },
    update: {},
    create: {
      id: 'material-math-2',
      subjectId: math.id,
      title: 'Pembagian Dasar',
      order: 2,
      cards: [
        { type: 'heading', value: 'Pembagian Dasar' },
        { type: 'text', value: 'Pembagian adalah kebalikan dari perkalian. Contoh: 12 ÷ 4 = 3' },
        { type: 'text', value: 'Jika kamu tahu perkalian, pembagian akan mudah!' },
      ],
    },
  })

  const engMaterial1 = await prisma.material.upsert({
    where: { id: 'material-eng-1' },
    update: {},
    create: {
      id: 'material-eng-1',
      subjectId: english.id,
      title: 'Animals Vocabulary',
      order: 1,
      cards: [
        { type: 'heading', value: 'Animals Vocabulary' },
        { type: 'text', value: 'Learn the names of animals in English: cat, dog, bird, fish, rabbit.' },
        { type: 'text', value: 'Practice: "I have a cat. My cat is orange."' },
      ],
    },
  })

  const engMaterial2 = await prisma.material.upsert({
    where: { id: 'material-eng-2' },
    update: {},
    create: {
      id: 'material-eng-2',
      subjectId: english.id,
      title: 'Colors in English',
      order: 2,
      cards: [
        { type: 'heading', value: 'Colors in English' },
        { type: 'text', value: 'Colors: red, blue, green, yellow, orange, purple, white, black.' },
        { type: 'text', value: 'Practice: "The sky is blue. The grass is green."' },
      ],
    },
  })

  await seedGames(prisma)

  await seedQuiz('quiz-math-1', 'Kuis Perkalian Dasar', mathMaterial1.id, math.id, [
    {
      text: 'Berapa hasil dari 3 × 4?',
      options: [
        { text: '10', isCorrect: false },
        { text: '12', isCorrect: true },
        { text: '14', isCorrect: false },
        { text: '7', isCorrect: false },
      ],
    },
    {
      text: 'Berapa hasil dari 5 × 5?',
      options: [
        { text: '20', isCorrect: false },
        { text: '30', isCorrect: false },
        { text: '25', isCorrect: true },
        { text: '10', isCorrect: false },
      ],
    },
    {
      text: 'Berapa hasil dari 2 × 7?',
      options: [
        { text: '14', isCorrect: true },
        { text: '9', isCorrect: false },
        { text: '12', isCorrect: false },
        { text: '16', isCorrect: false },
      ],
    },
  ])

  await seedQuiz('quiz-math-2', 'Kuis Pembagian Dasar', mathMaterial2.id, math.id, [
    {
      text: 'Berapa hasil dari 12 ÷ 4?',
      options: [
        { text: '2', isCorrect: false },
        { text: '4', isCorrect: false },
        { text: '3', isCorrect: true },
        { text: '6', isCorrect: false },
      ],
    },
    {
      text: 'Berapa hasil dari 20 ÷ 5?',
      options: [
        { text: '3', isCorrect: false },
        { text: '4', isCorrect: true },
        { text: '5', isCorrect: false },
        { text: '6', isCorrect: false },
      ],
    },
    {
      text: 'Berapa hasil dari 18 ÷ 3?',
      options: [
        { text: '5', isCorrect: false },
        { text: '7', isCorrect: false },
        { text: '6', isCorrect: true },
        { text: '9', isCorrect: false },
      ],
    },
  ])

  await seedQuiz('quiz-eng-1', 'Animals Quiz', engMaterial1.id, english.id, [
    {
      text: 'What is the English word for "kucing"?',
      options: [
        { text: 'dog', isCorrect: false },
        { text: 'cat', isCorrect: true },
        { text: 'bird', isCorrect: false },
        { text: 'fish', isCorrect: false },
      ],
    },
    {
      text: 'What animal says "woof"?',
      options: [
        { text: 'cat', isCorrect: false },
        { text: 'rabbit', isCorrect: false },
        { text: 'dog', isCorrect: true },
        { text: 'fish', isCorrect: false },
      ],
    },
    {
      text: 'Which animal can fly?',
      options: [
        { text: 'fish', isCorrect: false },
        { text: 'dog', isCorrect: false },
        { text: 'cat', isCorrect: false },
        { text: 'bird', isCorrect: true },
      ],
    },
  ])

  await seedQuiz('quiz-eng-2', 'Colors Quiz', engMaterial2.id, english.id, [
    {
      text: 'What color is the sky?',
      options: [
        { text: 'red', isCorrect: false },
        { text: 'blue', isCorrect: true },
        { text: 'green', isCorrect: false },
        { text: 'yellow', isCorrect: false },
      ],
    },
    {
      text: 'What color is grass?',
      options: [
        { text: 'blue', isCorrect: false },
        { text: 'orange', isCorrect: false },
        { text: 'green', isCorrect: true },
        { text: 'purple', isCorrect: false },
      ],
    },
    {
      text: 'What color is the sun?',
      options: [
        { text: 'yellow', isCorrect: true },
        { text: 'white', isCorrect: false },
        { text: 'black', isCorrect: false },
        { text: 'red', isCorrect: false },
      ],
    },
  ])

  console.log('Seed completed:', { admin: admin.email })
}

async function seedQuiz(quizId, title, materialId, subjectId, questions) {
  const existing = await prisma.quiz.findUnique({ where: { id: quizId } })
  if (existing) return

  await prisma.quiz.create({
    data: {
      id: quizId,
      title,
      materialId,
      subjectId,
      type: 'MULTIPLE_CHOICE',
      questions: {
        create: questions.map((q) => ({
          text: q.text,
          points: 10,
          options: { create: q.options },
        })),
      },
    },
  })
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
