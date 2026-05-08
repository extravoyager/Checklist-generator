import { db } from '../data/store.js'

export function permissionsForRole(roleId) {
  return (db.roles.find(r => r.id === roleId) || { permissions: [] }).permissions
}
