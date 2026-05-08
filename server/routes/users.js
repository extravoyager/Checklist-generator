import { Router } from 'express'
import { db } from '../data/store.js'

const r = Router()
r.get('/', (req, res) => res.json(db.users))
r.get('/:id', (req, res) => {
  const u = db.users.find(x => x.id === req.params.id)
  if (!u) return res.status(404).json({ error: 'Not found' })
  res.json(u)
})
export default r
