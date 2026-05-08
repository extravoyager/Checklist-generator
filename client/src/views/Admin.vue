<script setup>
import { ref } from 'vue'
import Card from '../components/ui/Card.vue'
import Tabs from '../components/ui/Tabs.vue'
import Badge from '../components/ui/Badge.vue'
import { users, sites, regions, areas, assets } from '../data/seedData'
import { hazardCategories, criticalControls } from '../data/ehsTaxonomy'
import { useRoleStore } from '../stores/roles'
import { defaultRoles } from '../data/defaultRoles'

const tab = ref('users')
const tabs = [
  { id: 'users', label: 'Users' },
  { id: 'sites', label: 'Sites' },
  { id: 'assets', label: 'Assets' },
  { id: 'taxonomy', label: 'Hazard Taxonomy' },
  { id: 'cc', label: 'Critical Controls' },
  { id: 'response-sets', label: 'Response Sets' },
  { id: 'branding', label: 'Report Branding' }
]
const roles = useRoleStore()
function roleName(id) { return roles.roles.find(r => r.id === id)?.name || id }
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-semibold text-slate-800">Admin Settings</h1>
    <Tabs :tabs="tabs" v-model="tab" />

    <Card v-if="tab === 'users'" :padded="false">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 text-xs uppercase text-slate-500"><tr><th class="text-left px-4 py-2.5">Name</th><th class="text-left px-4 py-2.5">Email</th><th class="text-left px-4 py-2.5">Role</th><th class="text-left px-4 py-2.5">Site</th></tr></thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="u in users" :key="u.id" class="hover:bg-slate-50/50">
            <td class="px-4 py-3 flex items-center gap-2">
              <div class="w-7 h-7 rounded-full text-white text-xs font-semibold flex items-center justify-center" :style="{ backgroundColor: u.color }">{{ u.initials }}</div>
              <span class="font-medium text-slate-800">{{ u.name }}</span>
            </td>
            <td class="px-4 py-3 text-slate-600">{{ u.email }}</td>
            <td class="px-4 py-3"><Badge color="primary">{{ roleName(u.roleId) }}</Badge></td>
            <td class="px-4 py-3 text-slate-600">{{ sites.find(s => s.id === u.siteId)?.name || 'All sites' }}</td>
          </tr>
        </tbody>
      </table>
    </Card>

    <Card v-if="tab === 'sites'" :padded="false">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 text-xs uppercase text-slate-500"><tr><th class="text-left px-4 py-2.5">Site</th><th class="text-left px-4 py-2.5">Region</th><th class="text-left px-4 py-2.5">Type</th><th class="text-left px-4 py-2.5">Areas</th></tr></thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="s in sites" :key="s.id" class="hover:bg-slate-50/50">
            <td class="px-4 py-3 font-medium text-slate-800">{{ s.name }}<div class="text-xs text-slate-500">{{ s.address }}</div></td>
            <td class="px-4 py-3 text-slate-600">{{ regions.find(r => r.id === s.regionId)?.name }}</td>
            <td class="px-4 py-3 text-slate-600">{{ s.type }}</td>
            <td class="px-4 py-3 text-slate-600">{{ areas.filter(a => a.siteId === s.id).length }}</td>
          </tr>
        </tbody>
      </table>
    </Card>

    <Card v-if="tab === 'assets'" :padded="false">
      <div class="px-4 py-3 text-sm text-slate-500">Showing {{ assets.length }} assets - manage in the Assets module.</div>
      <table class="w-full text-sm">
        <thead class="bg-slate-50 text-xs uppercase text-slate-500"><tr><th class="text-left px-4 py-2.5">Asset</th><th class="text-left px-4 py-2.5">Type</th><th class="text-left px-4 py-2.5">Site</th></tr></thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="a in assets.slice(0, 12)" :key="a.id" class="hover:bg-slate-50/50">
            <td class="px-4 py-3 text-slate-800">{{ a.name }}</td>
            <td class="px-4 py-3 text-slate-600">{{ a.type }}</td>
            <td class="px-4 py-3 text-slate-600">{{ sites.find(s => s.id === a.siteId)?.name }}</td>
          </tr>
        </tbody>
      </table>
    </Card>

    <Card v-if="tab === 'taxonomy'">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div v-for="h in hazardCategories" :key="h.id" class="p-3 rounded-lg border border-slate-100">
          <div class="text-sm font-medium text-slate-800">{{ h.label }}</div>
          <div class="text-xs text-slate-500">{{ h.id }}</div>
        </div>
      </div>
    </Card>

    <Card v-if="tab === 'cc'" :padded="false">
      <ul class="divide-y divide-slate-100 text-sm">
        <li v-for="cc in criticalControls" :key="cc.id" class="px-4 py-3 flex items-center justify-between">
          <div><div class="font-medium text-slate-800">{{ cc.label }}</div><div class="text-xs text-slate-500">{{ cc.hazardId }}</div></div>
          <Badge color="red">critical control</Badge>
        </li>
      </ul>
    </Card>

    <Card v-if="tab === 'response-sets'">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-4 rounded-lg border border-slate-100"><div class="text-sm font-medium text-slate-800 mb-2">Yes / No / N/A</div><div class="text-xs text-slate-500">Standard pass/fail with N/A. "No" is flagged.</div></div>
        <div class="p-4 rounded-lg border border-slate-100"><div class="text-sm font-medium text-slate-800 mb-2">Pass / Fail / N/A</div><div class="text-xs text-slate-500">Used for equipment inspections. "Fail" is flagged.</div></div>
        <div class="p-4 rounded-lg border border-slate-100"><div class="text-sm font-medium text-slate-800 mb-2">Safe / At Risk / N/A</div><div class="text-xs text-slate-500">Behavioural observations. "At Risk" is flagged.</div></div>
      </div>
    </Card>

    <Card v-if="tab === 'branding'">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="label">Brand colour (primary)</label>
          <input type="color" class="input h-10" value="#3f6896" />
        </div>
        <div>
          <label class="label">Report header text</label>
          <input class="input" value="CheckWise EHS - Inspection Report" />
        </div>
        <div class="md:col-span-2">
          <label class="label">Footer disclaimer</label>
          <textarea class="input" rows="2">This inspection report is for internal use only and contains site-specific safety findings.</textarea>
        </div>
      </div>
    </Card>
  </div>
</template>
