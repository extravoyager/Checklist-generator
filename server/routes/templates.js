import { Router } from 'express'
import { db, saveDb } from '../data/store.js'

const r = Router()

r.get('/', (req, res) => res.json(db.templates))
r.get('/:id', (req, res) => {
  const t = db.templates.find(x => x.id === req.params.id)
  if (!t) return res.status(404).json({ error: 'Not found' })
  res.json(t)
})
r.post('/', (req, res) => {
  const t = { ...req.body, id: 'tpl-' + Math.random().toString(36).slice(2, 8), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  db.templates.push(t); saveDb(); res.json(t)
})
r.put('/:id', (req, res) => {
  const idx = db.templates.findIndex(x => x.id === req.params.id)
  if (idx < 0) return res.status(404).json({ error: 'Not found' })
  db.templates[idx] = { ...db.templates[idx], ...req.body, updatedAt: new Date().toISOString() }
  saveDb(); res.json(db.templates[idx])
})
r.post('/:id/publish', (req, res) => {
  const t = db.templates.find(x => x.id === req.params.id)
  if (!t) return res.status(404).json({ error: 'Not found' })
  t.status = 'published'; saveDb(); res.json(t)
})
r.post('/:id/duplicate', (req, res) => {
  const t = db.templates.find(x => x.id === req.params.id)
  if (!t) return res.status(404).json({ error: 'Not found' })
  const copy = { ...JSON.parse(JSON.stringify(t)), id: 'tpl-' + Math.random().toString(36).slice(2, 8), title: t.title + ' (Copy)', status: 'draft', isPreBuilt: false }
  db.templates.push(copy); saveDb(); res.json(copy)
})
r.delete('/:id', (req, res) => {
  db.templates = db.templates.filter(x => x.id !== req.params.id)
  saveDb(); res.json({ ok: true })
})

export default r
