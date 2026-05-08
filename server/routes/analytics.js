import { Router } from 'express'
import { db } from '../data/store.js'

const r = Router()

r.get('/dashboard', (req, res) => {
  const open = db.actions.filter(a => ['open','in_progress','blocked'].includes(a.status))
  res.json({
    inspectionsDue: 14,
    inProgress: db.inspections.filter(i => i.status === 'in_progress').length,
    completedThisWeek: db.inspections.filter(i => i.status === 'completed').length,
    openActions: open.length,
    overdueActions: open.filter(a => new Date(a.dueDate) < new Date()).length,
    avgScore: 78,
    criticalFailures: db.inspections.filter(i => i.status === 'critical_failure').length
  })
})

export default r
