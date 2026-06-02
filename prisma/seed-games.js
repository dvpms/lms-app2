import { PrismaClient } from '../src/generated/prisma/client.ts'
import { PrismaNeon } from '@prisma/adapter-neon'
import { pathToFileURL } from 'url'

export const GAME_SEEDS = [
  {
    type: 'word-arrangement',
    title: 'Susun Kata',
    description: 'Susun kata-kata acak menjadi kalimat yang benar dengan cara drag & drop.',
    emoji: '🔤',
    levels: [
      {
        levelKey: 'wa-1',
        order: 1,
        difficulty: 1,
        points: 20,
        payload: {
          words: ['apel', 'adalah', 'buah', 'merah'],
          correctOrder: ['apel', 'adalah', 'buah', 'merah'],
        },
      },
      {
        levelKey: 'wa-2',
        order: 2,
        difficulty: 2,
        points: 25,
        payload: {
          words: ['kucing', 'minum', 'suka', 'susu'],
          correctOrder: ['kucing', 'suka', 'minum', 'susu'],
        },
      },
      {
        levelKey: 'wa-3',
        order: 3,
        difficulty: 3,
        points: 30,
        payload: {
          words: ['buku', 'di', 'ada', 'meja', 'itu'],
          correctOrder: ['buku', 'itu', 'ada', 'di', 'meja'],
        },
      },
    ],
  },
  {
    type: 'word-puzzle',
    title: 'Teka-Teki Kata',
    description: 'Temukan kata-kata tersembunyi di dalam grid huruf.',
    emoji: '🔍',
    levels: [
      {
        levelKey: 'wp-1',
        order: 1,
        difficulty: 1,
        points: 30,
        payload: {
          grid: [
            ['C', 'A', 'T', 'X', 'X', 'X'],
            ['D', 'O', 'G', 'X', 'X', 'X'],
            ['F', 'I', 'S', 'H', 'X', 'X'],
            ['B', 'I', 'R', 'D', 'X', 'X'],
            ['X', 'X', 'X', 'X', 'X', 'X'],
          ],
          hiddenWords: ['CAT', 'DOG', 'FISH', 'BIRD'],
        },
      },
      {
        levelKey: 'wp-2',
        order: 2,
        difficulty: 2,
        points: 35,
        payload: {
          grid: [
            ['T', 'A', 'B', 'L', 'E', 'X'],
            ['C', 'H', 'A', 'I', 'R', 'X'],
            ['D', 'O', 'O', 'R', 'X', 'X'],
            ['F', 'L', 'O', 'O', 'R', 'X'],
            ['X', 'X', 'X', 'X', 'X', 'X'],
          ],
          hiddenWords: ['TABLE', 'CHAIR', 'DOOR', 'FLOOR'],
        },
      },
      {
        levelKey: 'wp-3',
        order: 3,
        difficulty: 3,
        points: 40,
        payload: {
          grid: [
            ['R', 'E', 'D', 'G', 'R', 'E'],
            ['E', 'N', 'B', 'L', 'U', 'E'],
            ['Y', 'E', 'L', 'L', 'O', 'W'],
            ['W', 'H', 'I', 'T', 'E', 'X'],
            ['X', 'X', 'X', 'X', 'X', 'X'],
          ],
          hiddenWords: ['RED', 'GREEN', 'BLUE', 'YELLOW', 'WHITE'],
        },
      },
    ],
  },
  {
    type: 'multiplication-puzzle',
    title: 'Puzzle Perkalian',
    description: 'Lengkapi persamaan matematika dengan menyeret angka yang tepat.',
    emoji: '✖️',
    levels: [
      {
        levelKey: 'mp-1',
        order: 1,
        difficulty: 1,
        points: 20,
        payload: {
          equation: {
            parts: ['_', '*', '3', '=', '12'],
            blanks: [0],
          },
          tiles: ['4', '5', '6', '3'],
        },
      },
      {
        levelKey: 'mp-2',
        order: 2,
        difficulty: 2,
        points: 25,
        payload: {
          equation: {
            parts: ['6', '*', '_', '=', '42'],
            blanks: [2],
          },
          tiles: ['5', '6', '7', '8'],
        },
      },
      {
        levelKey: 'mp-3',
        order: 3,
        difficulty: 3,
        points: 35,
        payload: {
          equation: {
            parts: ['_', '*', '_', '=', '36'],
            blanks: [0, 2],
          },
          tiles: ['4', '6', '9', '7'],
        },
      },
    ],
  },
]

export async function seedGames(prisma) {
  for (const gameSeed of GAME_SEEDS) {
    await seedGame(prisma, gameSeed)
  }
}

async function seedGame(prisma, gameSeed) {
  const game = await prisma.game.upsert({
    where: { type: gameSeed.type },
    update: {
      title: gameSeed.title,
      description: gameSeed.description,
      emoji: gameSeed.emoji,
      isActive: true,
    },
    create: {
      type: gameSeed.type,
      title: gameSeed.title,
      description: gameSeed.description,
      emoji: gameSeed.emoji,
      isActive: true,
    },
  })

  const incomingKeys = new Set(gameSeed.levels.map((level) => level.levelKey))
  const existingLevels = await prisma.gameLevel.findMany({
    where: { gameId: game.id },
    select: { levelKey: true },
  })

  for (const level of gameSeed.levels) {
    await prisma.gameLevel.upsert({
      where: {
        gameId_levelKey: {
          gameId: game.id,
          levelKey: level.levelKey,
        },
      },
      update: {
        order: level.order,
        difficulty: level.difficulty,
        points: level.points,
        payload: level.payload,
        isActive: true,
      },
      create: {
        gameId: game.id,
        levelKey: level.levelKey,
        order: level.order,
        difficulty: level.difficulty,
        points: level.points,
        payload: level.payload,
        isActive: true,
      },
    })
  }

  const obsoleteKeys = existingLevels
    .map((level) => level.levelKey)
    .filter((levelKey) => !incomingKeys.has(levelKey))

  if (obsoleteKeys.length > 0) {
    await prisma.gameLevel.deleteMany({
      where: {
        gameId: game.id,
        levelKey: { in: obsoleteKeys },
      },
    })
  }
}

async function run() {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
  const prisma = new PrismaClient({ adapter })

  try {
    await seedGames(prisma)
    console.log('Game seed completed')
  } finally {
    await prisma.$disconnect()
  }
}

const isDirectRun = process.argv[1] ? import.meta.url === pathToFileURL(process.argv[1]).href : false

if (isDirectRun) {
  run().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}