import { defineStore } from 'pinia'
import { defaultScoringConfig } from '../data/scoringDefaults'

const KEY = 'checkwise.scoringConfig'

export const useScoringStore = defineStore('scoring', {
  state: () => {
    let cfg = defaultScoringConfig
    try {
      const saved = localStorage.getItem(KEY)
      if (saved) cfg = JSON.parse(saved)
    } catch { /* noop */ }
    return { config: cfg }
  },
  actions: {
    update(patch) {
      this.config = { ...this.config, ...patch }
      localStorage.setItem(KEY, JSON.stringify(this.config))
    },
    reset() {
      this.config = { ...defaultScoringConfig }
      localStorage.setItem(KEY, JSON.stringify(this.config))
    }
  }
})
