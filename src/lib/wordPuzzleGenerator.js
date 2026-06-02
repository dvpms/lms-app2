'use strict'

// Simple word puzzle generator: places words horizontally or vertically (forward/backward optional)
// Algorithm: place longest-first, try random positions and directions, allow overlaps only when letters match.

function randInt(max) {
  return Math.floor(Math.random() * max)
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

function createEmptyGrid(rows, cols, fillChar = '') {
  const grid = []
  for (let r = 0; r < rows; r++) {
    grid.push(new Array(cols).fill(fillChar))
  }
  return grid
}

function canPlace(grid, word, r, c, dir, backwards) {
  const rows = grid.length
  const cols = grid[0].length
  const w = backwards ? word.split('').reverse() : word.split('')
  for (let i = 0; i < w.length; i++) {
    const rr = dir === 'H' ? r : r + i
    const cc = dir === 'H' ? c + i : c
    if (rr < 0 || rr >= rows || cc < 0 || cc >= cols) return false
    const ch = grid[rr][cc]
    if (ch && ch !== '' && ch !== w[i]) return false
  }
  return true
}

function placeWord(grid, word, r, c, dir, backwards) {
  const w = backwards ? word.split('').reverse() : word.split('')
  for (let i = 0; i < w.length; i++) {
    const rr = dir === 'H' ? r : r + i
    const cc = dir === 'H' ? c + i : c
    grid[rr][cc] = w[i]
  }
}

function fillGridRandom(grid) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (!grid[r][c] || grid[r][c] === '') grid[r][c] = letters[randInt(letters.length)]
    }
  }
}

export function generateGrid({ answers = [], options = {} } = {}) {
  // answers: array of strings
  // options: { maxSize: number, allowBackward: boolean, maxAttempts: number }
  const maxSize = options.maxSize ?? 15
  const allowBackward = options.allowBackward ?? false
  const maxAttempts = options.maxAttempts ?? 300

  const words = answers.map((w) => (w ?? '').toUpperCase().replace(/[^A-Z]/g, '')).filter(Boolean)
  if (words.length === 0) return { success: false, message: 'No words provided' }

  const longest = Math.max(...words.map((w) => w.length))
  let startSize = Math.max(longest, Math.ceil(Math.sqrt(words.reduce((s, w) => s + w.length, 0))))
  startSize = Math.max(5, startSize)
  if (startSize > maxSize) startSize = maxSize

  const dirs = ['H', 'V']

  for (let size = startSize; size <= maxSize; size++) {
    // Try multiple attempts to place all words
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const grid = createEmptyGrid(size, size, '')
      const placements = []
      const ordered = [...words].sort((a, b) => b.length - a.length)
      let failed = false

      for (const word of ordered) {
        const tries = 80
        let placed = false
        for (let t = 0; t < tries; t++) {
          const dir = dirs[randInt(dirs.length)]
          const backwards = allowBackward && Math.random() < 0.5
          const maxR = dir === 'H' ? size : size - word.length + 1
          const maxC = dir === 'H' ? size - word.length + 1 : size
          if (maxR <= 0 || maxC <= 0) continue
          const r = randInt(maxR)
          const c = randInt(maxC)
          if (canPlace(grid, word, r, c, dir, backwards)) {
            placeWord(grid, word, r, c, dir, backwards)
            placements.push({ word, r, c, dir, backwards })
            placed = true
            break
          }
        }
        if (!placed) {
          failed = true
          break
        }
      }

      if (!failed) {
        fillGridRandom(grid)
        return { success: true, grid, placements }
      }
    }
  }

  return { success: false, message: 'Could not place words within max size/attempts' }
}
