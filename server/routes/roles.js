import { Router } from 'express'
import { db, saveDb } from '../data/store.js'

const r = Router()
r.get('/', (req, res) => res.json(db.roles))
r.put('/:id', (req, res) => {
  const idx = db.roles.findIndex(x => x.id === req.params.id)
  if (idx < 0) return res.status(404).json({ error: 'Not found' })
  db.roles[idx] = { ...db.roles[idx], ...req.body }
  saveDb()
  res.json(db.roles[idx])
})
export default r
