<script setup>
import { ref, computed } from 'vue'
import Card from '../components/ui/Card.vue'
import Badge from '../components/ui/Badge.vue'
import { useFindingStore } from '../stores/findings'
import { hazardCategories } from '../data/ehsTaxonomy'
import { formatDate } from '../utils/formatDate'
import { useRouter } from 'vue-router'

const store = useFindingStore()
const router = useRouter()
const filterType = ref('all')
const filterSeverity = ref('all')
const filterStatus = ref('all')

const filtered = computed(() => store.list.filter(f => {
  if (filterType.value !== 'all' && f.type !== filterType.value) return false
  if (filterSeverity.value !== 'all' && f.severity !== filterSeverity.value) return false
  if (filterStatus.value !== 'all' && f.status !== filterStatus.value) return false
  return true
}))

function sevColor(s) { return { critical: 'red', high: 'orange', medium: 'amber', low: 'slate' }[s] }
function typeLabel(t) { return t.replace(/_/g, ' ') }
function hazardLabel(id) { return hazardCategories.find(h => h.id === id)?.label || id }
</script>

<template>
  <div class="space-y-4">
    <div>
      <h1 class="text-2xl font-semibold text-slate-800">Findings</h1>
      <p class="text-sm text-slate-500">{{ filtered.length }} findings - {{ filtered.filter(f => f.sifPotential).length }} SIF-potential</p>
    </div>
    <Card :padded="false">
      <div class="p-4 flex flex-wrap items-center gap-3 border-b border-slate-100">
        <select v-model="filterType" class="input max-w-[200px]">
          <option value="all">All types</option>
          <option value="observation">Observation</option>
          <option value="unsafe_act">Unsafe act</option>
          <option value="unsafe_condition">Unsafe condition</option>
          <option value="near_miss">Near miss</option>
          <option value="critical_control_failure">Critical control failure</option>
        </select>
        <select v-model="filterSeverity" class="input max-w-[160px]">
          <option value="all">All severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select v-model="filterStatus" class="input max-w-[160px]">
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="in_review">In review</option>
          <option value="closed">Closed</option>
        </select>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th class="text-left px-4 py-2.5">Finding</th>
              <th class="text-left px-4 py-2.5">Type</th>
              <th class="text-left px-4 py-2.5">Hazard</th>
              <th class="text-left px-4 py-2.5">Severity</th>
              <th class="text-left px-4 py-2.5">SIF</th>
              <th class="text-left px-4 py-2.5">Site</th>
              <th class="text-left px-4 py-2.5">Date</th>
              <th class="text-left px-4 py-2.5">Source</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="f in filtered" :key="f.id" :class="['hover:bg-slate-50/50', f.sifPotential ? 'bg-red-50/40' : '']">
              <td class="px-4 py-3 text-slate-800 font-medium">{{ f.title }}<div class="text-xs text-slate-500">{{ f.description }}</div></td>
              <td class="px-4 py-3 text-slate-600">{{ typeLabel(f.type) }}</td>
              <td class="px-4 py-3 text-slate-600">{{ hazardLabel(f.hazardCategory) }}</td>
              <td class="px-4 py-3"><Badge :color="sevColor(f.severity)">{{ f.severity }}</Badge></td>
              <td class="px-4 py-3"><Badge v-if="f.sifPotential" color="red">SIF</Badge><span v-else class="text-xs text-slate-400">-</span></td>
              <td class="px-4 py-3 text-slate-600">{{ f.siteName }}</td>
              <td class="px-4 py-3 text-slate-600">{{ formatDate(f.reportedAt) }}</td>
              <td class="px-4 py-3"><button class="text-primary-600 hover:underline text-xs" @click="router.push('/reports/' + f.sourceInspectionId)">{{ f.sourceInspectionId }}</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  </div>
</template>
