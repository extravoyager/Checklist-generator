import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { buildSeed } from './seed.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, 'db.json')

export const db = {}

export async function loadDb() {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf-8')
    Object.assign(db, JSON.parse(raw))
    if (!db.users || !db.users.length) throw new Error('empty')
  } catch {
    Object.assign(db, buildSeed())
    await saveDb()
    console.log('[checkwise-server] seeded db.json')
  }
}

let saveTimer = null
export function saveDb() {
  // debounce writes
  if (saveTimer) clearTimeout(saveTimer)
  return new Promise((resolve, reject) => {
    saveTimer = setTimeout(async () => {
      try {
        await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2))
        resolve()
      } catch (e) { reject(e) }
    }, 50)
  })
}
