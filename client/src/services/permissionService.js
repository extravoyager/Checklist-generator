import { defaultRoles } from '../data/defaultRoles'

export function permissionsForRole(roleId, customRoles = null) {
  const list = customRoles || defaultRoles
  return (list.find(r => r.id === roleId) || list[list.length - 1]).permissions
}

export function can(permKey, perms) {
  if (!perms) return false
  return perms.includes(permKey)
}
