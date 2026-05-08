import { Router } from 'express'
import { db, saveDb } from '../data/store.js'

const r = Router()

r.get('/', (req, res) => res.json(db.inspections))
r.get('/:id', (req, res) => {
  const i = db.inspections.find(x => x.id === req.params.id)
  if (!i) return res.status(404).json({ error: 'Not found' })
  res.json(i)
})
r.post('/', (req, res) => {
  const ins = { ...req.body, id: 'ins-' + Math.random().toString(36).slice(2, 8), startedAt: new Date().toISOString(), status: 'in_progress', responses: {}, progress: 0 }
  db.inspections.unshift(ins); saveDb(); res.json(ins)
})
r.put('/:id', (req, res) => {
  const idx = db.inspections.findIndex(x => x.id === req.params.id)
  if (idx < 0) return res.status(404).json({ error: 'Not found' })
  db.inspections[idx] = { ...db.inspections[idx], ...req.body }
  saveDb(); res.json(db.inspections[idx])
})
r.post('/:id/complete', (req, res) => {
  const ins = db.inspections.find(x => x.id === req.params.id)
  if (!ins) return res.status(404).json({ error: 'Not found' })
  Object.assign(ins, req.body, { completedAt: new Date().toISOString(), status: req.body.status || 'completed', progress: 100 })
  saveDb(); res.json(ins)
})

export default r
