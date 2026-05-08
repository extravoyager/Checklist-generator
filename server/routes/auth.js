import { Router } from 'express'
import { db } from '../data/store.js'

const r = Router()

r.post('/login', (req, res) => {
  const { userId } = req.body || {}
  const user = db.users.find(u => u.id === userId)
  if (!user) return res.status(404).json({ error: 'User not found' })
  const role = db.roles.find(x => x.id === user.roleId)
  res.json({ user, permissions: role?.permissions || [], role })
})

r.get('/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' })
  const role = db.roles.find(x => x.id === req.user.roleId)
  res.json({ user: req.user, permissions: req.permissions, role })
})

export default r
