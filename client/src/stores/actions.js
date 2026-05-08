import { defineStore } from 'pinia'
import { actions as seedActions } from '../data/seedData'
import { uid } from '../utils/downloadJson'

export const useActionStore = defineStore('actions', {
  state: () => ({ list: [...seedActions] }),
  getters: {
    byStatus: (s) => (status) => s.list.filter(a => a.status === status),
    findById: (s) => (id) => s.list.find(a => a.id === id)
  },
  actions: {
    create(payload) {
      const a = {
        id: 'act-' + uid('').slice(-6),
        title: payload.title,
        description: payload.description || '',
        priority: payload.priority || 'medium',
        status: 'open',
        ownerId: payload.ownerId,
        ownerName: payload.ownerName,
        siteId: payload.siteId,
        siteName: payload.siteName,
        sourceInspectionId: payload.sourceInspectionId,
        dueDate: payload.dueDate || new Date(Date.now() + 7 * 86400000).toISOString(),
        createdAt: new Date().toISOString(),
        verifiedAt: null
      }
      this.list.unshift(a)
      return a
    },
    update(id, patch) {
      const idx = this.list.findIndex(a => a.id === id)
      if (idx >= 0) this.list[idx] = { ...this.list[idx], ...patch }
    },
    move(id, status) {
      this.update(id, { status, verifiedAt: status === 'verified' ? new Date().toISOString() : null })
    }
  }
})
