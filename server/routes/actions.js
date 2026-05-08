import { Router } from 'express'
import { db, saveDb } from '../data/store.js'

const r = Router()

r.get('/', (req, res) => res.json(db.actions))
r.post('/', (req, res) => {
  const a = { ...req.body, id: 'act-' + Math.random().toString(36).slice(2, 8), createdAt: new Date().toISOString(), status: 'open' }
  db.actions.unshift(a); saveDb(); res.json(a)
})
r.put('/:id', (req, res) => {
  const idx = db.actions.findIndex(x => x.id === req.params.id)
  if (idx < 0) return res.status(404).json({ error: 'Not found' })
  db.actions[idx] = { ...db.actions[idx], ...req.body }
  saveDb(); res.json(db.actions[idx])
})

export default r
