import { db } from '../data/store.js'

export function authMiddleware(req, res, next) {
  const id = req.header('x-user-id')
  if (id) {
    const user = db.users.find(u => u.id === id)
    if (user) {
      const role = db.roles.find(r => r.id === user.roleId)
      req.user = user
      req.permissions = role ? role.permissions : []
    }
  }
  next()
}

export function requirePerm(perm) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' })
    if (!req.permissions.includes(perm)) return res.status(403).json({ error: 'Forbidden: ' + perm })
    next()
  }
}
