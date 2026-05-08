import { defineStore } from 'pinia'
import { findings as seedFindings } from '../data/seedData'

export const useFindingStore = defineStore('findings', {
  state: () => ({ list: [...seedFindings] }),
  actions: {
    update(id, patch) {
      const idx = this.list.findIndex(f => f.id === id)
      if (idx >= 0) this.list[idx] = { ...this.list[idx], ...patch }
    }
  }
})
