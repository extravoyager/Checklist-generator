import { defineStore } from 'pinia'
import { customTemplates, preBuiltChecklists } from '../data/seedData'
import { uid } from '../utils/downloadJson'

export const useTemplateStore = defineStore('templates', {
  state: () => ({
    custom: [...customTemplates],
    prebuilt: [...preBuiltChecklists]
  }),
  getters: {
    all: (s) => [...s.custom, ...s.prebuilt],
    findById: (s) => (id) => s.custom.find(t => t.id === id) || s.prebuilt.find(t => t.id === id)
  },
  actions: {
    save(template) {
      const idx = this.custom.findIndex(t => t.id === template.id)
      template.updatedAt = new Date().toISOString()
      template.questionCount = template.sections.reduce((a, s) => a + s.questions.length, 0)
      template.sectionCount = template.sections.length
      if (idx >= 0) this.custom[idx] = { ...template }
      else this.custom.push({ ...template })
    },
    create(template) {
      const t = {
        ...template,
        id: 'tpl-' + uid('').slice(-6),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: template.status || 'draft',
        version: template.version || '0.1',
        isPreBuilt: false
      }
      t.questionCount = t.sections.reduce((a, s) => a + s.questions.length, 0)
      t.sectionCount = t.sections.length
      this.custom.push(t)
      return t
    },
    duplicate(id) {
      const tpl = this.findById(id)
      if (!tpl) return null
      const copy = JSON.parse(JSON.stringify(tpl))
      copy.id = 'tpl-' + uid('').slice(-6)
      copy.title = tpl.title + ' (Copy)'
      copy.status = 'draft'
      copy.isPreBuilt = false
      copy.version = '0.1'
      copy.createdAt = new Date().toISOString()
      copy.updatedAt = new Date().toISOString()
      this.custom.push(copy)
      return copy
    },
    publish(id) {
      const t = this.custom.find(t => t.id === id)
      if (t) { t.status = 'published'; t.updatedAt = new Date().toISOString() }
    },
    archive(id) {
      const t = this.custom.find(t => t.id === id)
      if (t) { t.status = 'archived'; t.updatedAt = new Date().toISOString() }
    },
    remove(id) {
      this.custom = this.custom.filter(t => t.id !== id)
    }
  }
})
