import { defineStore } from 'pinia'
import { inspections as seedInspections } from '../data/seedData'
import { uid } from '../utils/downloadJson'

export const useInspectionStore = defineStore('inspections', {
  state: () => ({
    list: [...seedInspections]
  }),
  getters: {
    findById: (s) => (id) => s.list.find(i => i.id === id)
  },
  actions: {
    create(payload) {
      const ins = {
        id: 'ins-' + uid('').slice(-6),
        templateId: payload.templateId,
        templateTitle: payload.templateTitle,
        siteId: payload.siteId,
        siteName: payload.siteName,
        assignedTo: payload.assignedTo,
        assignedToName: payload.assignedToName,
        status: 'in_progress',
        progress: 0,
        score: null,
        criticalFailures: 0,
        flaggedCount: 0,
        startedAt: new Date().toISOString(),
        completedAt: null,
        dueDate: payload.dueDate || new Date(Date.now() + 86400000 * 7).toISOString(),
        responses: {}
      }
      this.list.unshift(ins)
      return ins
    },
    update(id, patch) {
      const idx = this.list.findIndex(i => i.id === id)
      if (idx >= 0) this.list[idx] = { ...this.list[idx], ...patch }
    },
    setResponse(id, qid, value) {
      const ins = this.list.find(i => i.id === id)
      if (!ins) return
      ins.responses = { ...ins.responses, [qid]: value }
    },
    complete(id, scoreResult) {
      this.update(id, {
        status: scoreResult.criticalFailureFlag ? 'critical_failure' : 'completed',
        progress: 100,
        score: scoreResult.totalScore,
        criticalFailures: scoreResult.criticalFailures,
        flaggedCount: scoreResult.flaggedCount,
        completedAt: new Date().toISOString()
      })
    }
  }
})
