import { defineStore } from 'pinia'
import { defaultRoles, allPermissions } from '../data/defaultRoles'
import { users } from '../data/seedData'

const KEY = 'checkwise.roles'

export const useRoleStore = defineStore('roles', {
  state: () => {
    let roles = defaultRoles
    try {
      const saved = localStorage.getItem(KEY)
      if (saved) roles = JSON.parse(saved)
    } catch { /* noop */ }
    return { roles, permissions: allPermissions, users: [...users] }
  },
  actions: {
    save() { localStorage.setItem(KEY, JSON.stringify(this.roles)) },
    togglePerm(roleId, perm) {
      const r = this.roles.find(r => r.id === roleId)
      if (!r) return
      if (r.permissions.includes(perm)) r.permissions = r.permissions.filter(p => p !== perm)
      else r.permissions = [...r.permissions, perm]
      this.save()
    },
    addRole(name) {
      this.roles.push({ id: 'role-' + Math.random().toString(36).slice(2, 8), name, description: 'Custom role', permissions: [] })
      this.save()
    },
    duplicateRole(id) {
      const r = this.roles.find(x => x.id === id)
      if (!r) return
      this.roles.push({ ...r, id: 'role-' + Math.random().toString(36).slice(2, 8), name: r.name + ' (Copy)', system: false })
      this.save()
    },
    removeRole(id) {
      this.roles = this.roles.filter(r => r.id !== id)
      this.save()
    }
  }
})
