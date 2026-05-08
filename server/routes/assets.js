import { Router } from 'express'
import { db } from '../data/store.js'
const r = Router()
r.get('/', (req, res) => res.json(db.assets))
r.get('/:id', (req, res) => {
  const a = db.assets.find(x => x.id === req.params.id)
  if (!a) return res.status(404).json({ error: 'Not found' })
  res.json(a)
})
export default r
