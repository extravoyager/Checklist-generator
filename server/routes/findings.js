import { Router } from 'express'
import { db, saveDb } from '../data/store.js'

const r = Router()

r.get('/', (req, res) => res.json(db.findings))
r.post('/', (req, res) => {
  const f = { ...req.body, id: 'fnd-' + Math.random().toString(36).slice(2, 8), reportedAt: new Date().toISOString(), status: 'open' }
  db.findings.unshift(f); saveDb(); res.json(f)
})
r.put('/:id', (req, res) => {
  const idx = db.findings.findIndex(x => x.id === req.params.id)
  if (idx < 0) return res.status(404).json({ error: 'Not found' })
  db.findings[idx] = { ...db.findings[idx], ...req.body }
  saveDb(); res.json(db.findings[idx])
})

export default r
