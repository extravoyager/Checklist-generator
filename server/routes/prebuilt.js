import { Router } from 'express'
import { db, saveDb } from '../data/store.js'

const r = Router()

r.get('/', (req, res) => res.json(db.prebuiltChecklists || []))

r.get('/:id', (req, res) => {
  const t = (db.prebuiltChecklists || []).find(x => x.id === req.params.id)
  if (!t) return res.status(404).json({ error: 'Not found' })
  res.json(t)
})

// Duplicate a pre-built checklist into the editable templates collection as a draft.
r.post('/:id/duplicate', (req, res) => {
  const src = (db.prebuiltChecklists || []).find(x => x.id === req.params.id)
  if (!src) return res.status(404).json({ error: 'Not found' })
  const copy = {
    ...JSON.parse(JSON.stringify(src)),
    id: 'tpl-' + Math.random().toString(36).slice(2, 8),
    title: src.title + ' (Custom)',
    status: 'draft',
    isPreBuilt: false,
    isLocked: false,
    originalTemplateId: src.id,
    version: '0.1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  db.templates.push(copy)
  saveDb()
  res.json(copy)
})

export default r
