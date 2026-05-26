export const wordArrangementLevels = [
  {
    id: 'wa-1',
    difficulty: 1,
    words: ['apel', 'adalah', 'buah', 'merah'],
    correctOrder: ['apel', 'adalah', 'buah', 'merah'],
    points: 20,
  },
  {
    id: 'wa-2',
    difficulty: 2,
    words: ['kucing', 'minum', 'suka', 'susu'],
    correctOrder: ['kucing', 'suka', 'minum', 'susu'],
    points: 25,
  },
  {
    id: 'wa-3',
    difficulty: 3,
    words: ['buku', 'di', 'ada', 'meja', 'itu'],
    correctOrder: ['buku', 'itu', 'ada', 'di', 'meja'],
    points: 30,
  },
]

export const wordPuzzleLevels = [
  {
    id: 'wp-1',
    difficulty: 1,
    grid: [
      ['K', 'U', 'C', 'I', 'N', 'G'],
      ['A', 'N', 'J', 'I', 'N', 'G'],
      ['I', 'K', 'A', 'N', 'X', 'Z'],
      ['B', 'U', 'R', 'U', 'N', 'G'],
      ['Z', 'X', 'Y', 'W', 'V', 'U'],
    ],
    hiddenWords: ['KUCING', 'ANJING', 'IKAN', 'BURUNG'],
    points: 30,
  },
  {
    id: 'wp-2',
    difficulty: 2,
    grid: [
      ['M', 'E', 'J', 'A', 'X', 'Z'],
      ['K', 'U', 'R', 'S', 'I', 'Y'],
      ['P', 'I', 'N', 'T', 'U', 'W'],
      ['J', 'E', 'N', 'D', 'E', 'L'],
      ['L', 'A', 'N', 'T', 'A', 'I'],
    ],
    hiddenWords: ['MEJA', 'KURSI', 'PINTU', 'LANTAI'],
    points: 35,
  },
  {
    id: 'wp-3',
    difficulty: 3,
    grid: [
      ['M', 'E', 'R', 'A', 'H', 'Z'],
      ['H', 'I', 'J', 'A', 'U', 'X'],
      ['B', 'I', 'R', 'U', 'Y', 'W'],
      ['K', 'U', 'N', 'I', 'N', 'G'],
      ['P', 'U', 'T', 'I', 'H', 'V'],
    ],
    hiddenWords: ['MERAH', 'HIJAU', 'BIRU', 'KUNING', 'PUTIH'],
    points: 40,
  },
]

export const multiplicationPuzzleLevels = [
  {
    id: 'mp-1',
    difficulty: 1,
    equation: {
      parts: ['_', '*', '3', '=', '12'],
      blanks: [0],
    },
    tiles: ['4', '5', '6', '3'],
    points: 20,
  },
  {
    id: 'mp-2',
    difficulty: 2,
    equation: {
      parts: ['6', '*', '_', '=', '42'],
      blanks: [2],
    },
    tiles: ['5', '6', '7', '8'],
    points: 25,
  },
  {
    id: 'mp-3',
    difficulty: 3,
    equation: {
      parts: ['_', '*', '_', '=', '36'],
      blanks: [0, 2],
    },
    tiles: ['4', '6', '9', '7'],
    points: 35,
  },
]

export const GAME_META = {
  'word-arrangement': {
    title: 'Susun Kata',
    description: 'Susun kata-kata acak menjadi kalimat yang benar dengan cara drag & drop.',
    emoji: '🔤',
    levels: wordArrangementLevels,
  },
  'word-puzzle': {
    title: 'Teka-Teki Kata',
    description: 'Temukan kata-kata tersembunyi di dalam grid huruf.',
    emoji: '🔍',
    levels: wordPuzzleLevels,
  },
  'multiplication-puzzle': {
    title: 'Puzzle Perkalian',
    description: 'Lengkapi persamaan matematika dengan menyeret angka yang tepat.',
    emoji: '✖️',
    levels: multiplicationPuzzleLevels,
  },
}
