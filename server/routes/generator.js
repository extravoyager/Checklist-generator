import { Router } from 'express'
import { generateChecklist } from '../services/generatorService.js'
const r = Router()
r.post('/checklist', (req, res) => {
  const tpl = generateChecklist(req.body || {})
  res.json(tpl)
})
export default r
