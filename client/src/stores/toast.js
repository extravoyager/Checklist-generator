import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', {
  state: () => ({ items: [] }),
  actions: {
    push(message, type = 'info', timeout = 3000) {
      const id = Math.random().toString(36).slice(2)
      this.items.push({ id, message, type })
      setTimeout(() => this.dismiss(id), timeout)
    },
    success(m) { this.push(m, 'success') },
    error(m) { this.push(m, 'error', 5000) },
    info(m) { this.push(m, 'info') },
    dismiss(id) {
      this.items = this.items.filter(i => i.id !== id)
    }
  }
})
