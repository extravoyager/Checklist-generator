import { Router } from 'express'
import { calculateScore } from '../services/scoringService.js'
import { db, saveDb } from '../data/store.js'

const r = Router()

r.get('/config', (req, res) => res.json(db.scoringConfig))
r.put('/config', (req, res) => {
  db.scoringConfig = { ...db.scoringConfig, ...req.body }
  saveDb(); res.json(db.scoringConfig)
})
r.post('/calculate', (req, res) => {
  const { template, responses, settings } = req.body || {}
  if (!template) return res.status(400).json({ error: 'template required' })
  res.json(calculateScore(template, responses || {}, settings || db.scoringConfig))
})

export default r
