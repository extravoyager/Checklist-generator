import { Router } from 'express'
import { db } from '../data/store.js'

const r = Router()

r.get('/inspection/:id', (req, res) => {
  const ins = db.inspections.find(i => i.id === req.params.id)
  if (!ins) return res.status(404).json({ error: 'Not found' })
  const linkedActions = db.actions.filter(a => a.sourceInspectionId === ins.id)
  const linkedFindings = db.findings.filter(f => f.sourceInspectionId === ins.id)
  res.json({ inspection: ins, actions: linkedActions, findings: linkedFindings })
})

export default r
