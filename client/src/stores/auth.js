import { defineStore } from 'pinia'
import { users } from '../data/seedData'
import { defaultRoles } from '../data/defaultRoles'
import { permissionsForRole } from '../services/permissionService'

const STORAGE_KEY = 'checkwise.user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    perms: []
  }),
  actions: {
    restore() {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
        if (saved) this._setUser(saved)
      } catch { /* noop */ }
    },
    login(userId) {
      const u = users.find(x => x.id === userId)
      if (!u) throw new Error('Unknown user')
      this._setUser(u)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    },
    logout() {
      this.user = null
      this.perms = []
      localStorage.removeItem(STORAGE_KEY)
    },
    _setUser(u) {
      this.user = u
      this.perms = permissionsForRole(u.roleId)
    },
    can(perm) {
      return this.perms.includes(perm)
    }
  },
  getters: {
    role: (s) => s.user ? defaultRoles.find(r => r.id === s.user.roleId) : null
  }
})
