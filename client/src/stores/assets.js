import { defineStore } from 'pinia'
import { assets as seedAssets, sites as seedSites } from '../data/seedData'

export const useAssetStore = defineStore('assets', {
  state: () => ({ list: [...seedAssets], sites: [...seedSites] }),
  getters: {
    findById: (s) => (id) => s.list.find(a => a.id === id),
    siteName: (s) => (id) => s.sites.find(x => x.id === id)?.name || ''
  }
})
