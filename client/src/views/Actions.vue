<script setup>
import { ref, computed } from 'vue'
import Card from '../components/ui/Card.vue'
import Badge from '../components/ui/Badge.vue'
import Button from '../components/ui/Button.vue'
import Drawer from '../components/ui/Drawer.vue'
import { useActionStore } from '../stores/actions'
import { useAuthStore } from '../stores/auth'
import { LayoutGrid, List, ChevronRight, CheckCircle2 } from 'lucide-vue-next'
import { formatDate, daysFromNow } from '../utils/formatDate'

const store = useActionStore()
const auth = useAuthStore()

const view = ref('kanban')
const filterPriority = ref('all')
const filterSite = ref('all')
const filterStatus = ref('all')
const drawerAction = ref(null)

const columns = [
  { id: 'open', label: 'Open' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'blocked', label: 'Blocked' },
  { id: 'completed', label: 'Completed' },
  { id: 'verified', label: 'Verified' }
]

function priorityColor(p) { return { critical: 'red', high: 'orange', medium: 'amber', low: 'slate' }[p] }

const filtered = computed(() => store.list.filter(a => {
  if (filterPriority.value !== 'all' && a.priority !== filterPriority.value) return false
  if (filterStatus.value !== 'all' && a.status !== filterStatus.value) return false
  return true
}))

function inColumn(c) { return filtered.value.filter(a => a.status === c.id) }

function move(action, status) { store.move(action.id, status); if (drawerAction.value?.id === action.id) drawerAction.value = { ...action, status } }
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-start justify-between flex-wrap gap-3">
      <div>
        <h1 class="text-2xl font-semibold text-slate-800">Actions</h1>
        <p class="text-sm text-slate-500">{{ filtered.length }} actions</p>
      </div>
      <div class="flex items-center gap-2">
        <select v-model="filterPriority" class="input max-w-[160px]">
          <option value="all">All priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <div class="bg-white rounded-lg border border-slate-200 flex">
          <button @click="view = 'kanban'" :class="['px-3 py-1.5 text-sm rounded-l-lg', view === 'kanban' ? 'bg-slate-100 text-slate-900' : 'text-slate-500']"><LayoutGrid class="w-4 h-4" /></button>
          <button @click="view = 'table'" :class="['px-3 py-1.5 text-sm rounded-r-lg', view === 'table' ? 'bg-slate-100 text-slate-900' : 'text-slate-500']"><List class="w-4 h-4" /></button>
        </div>
      </div>
    </div>

    <div v-if="view === 'kanban'" class="grid grid-cols-2 md:grid-cols-5 gap-3">
      <div v-for="c in columns" :key="c.id" class="bg-slate-100/70 rounded-xl p-3 min-h-[200px]">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-sm font-semibold text-slate-700">{{ c.label }}</h3>
          <span class="text-xs text-slate-500">{{ inColumn(c).length }}</span>
        </div>
        <div class="space-y-2">
          <div v-for="a in inColumn(c)" :key="a.id"
            @click="drawerAction = a"
            class="bg-white rounded-lg border border-slate-100 p-3 shadow-soft cursor-pointer hover:border-primary-200">
            <div class="flex items-start justify-between gap-2">
              <div class="text-sm font-medium text-slate-800 line-clamp-2">{{ a.title }}</div>
              <Badge :color="priorityColor(a.priority)">{{ a.priority }}</Badge>
            </div>
            <div class="mt-2 text-[11px] text-slate-500">{{ a.siteName }}</div>
            <div class="mt-1 flex items-center justify-between text-[11px]">
              <span :class="daysFromNow(a.dueDate) < 0 ? 'text-red-600' : 'text-slate-500'">
                {{ formatDate(a.dueDate) }}
              </span>
              <span class="text-slate-500">{{ a.ownerName.split(' ')[0] }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Card v-else :padded="false">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th class="text-left px-4 py-2.5">Title</th>
              <th class="text-left px-4 py-2.5">Priority</th>
              <th class="text-left px-4 py-2.5">Status</th>
              <th class="text-left px-4 py-2.5">Owner</th>
              <th class="text-left px-4 py-2.5">Site</th>
              <th class="text-left px-4 py-2.5">Due</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="a in filtered" :key="a.id" @click="drawerAction = a" class="hover:bg-slate-50/50 cursor-pointer">
              <td class="px-4 py-3 text-slate-800 font-medium">{{ a.title }}</td>
              <td class="px-4 py-3"><Badge :color="priorityColor(a.priority)">{{ a.priority }}</Badge></td>
              <td class="px-4 py-3"><Badge color="slate">{{ a.status.replace('_',' ') }}</Badge></td>
              <td class="px-4 py-3 text-slate-600">{{ a.ownerName }}</td>
              <td class="px-4 py-3 text-slate-600">{{ a.siteName }}</td>
              <td class="px-4 py-3 text-slate-600">
                <span :class="daysFromNow(a.dueDate) < 0 ? 'text-red-600' : ''">{{ formatDate(a.dueDate) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>

    <Drawer :open="!!drawerAction" :title="drawerAction?.title" @close="drawerAction = null">
      <div v-if="drawerAction" class="space-y-3">
        <div class="flex items-center gap-2">
          <Badge :color="priorityColor(drawerAction.priority)">{{ drawerAction.priority }}</Badge>
          <Badge color="slate">{{ drawerAction.status.replace('_', ' ') }}</Badge>
        </div>
        <div class="text-sm text-slate-600">{{ drawerAction.description }}</div>
        <dl class="text-xs space-y-1">
          <div class="flex justify-between"><dt class="text-slate-500">Owner</dt><dd>{{ drawerAction.ownerName }}</dd></div>
          <div class="flex justify-between"><dt class="text-slate-500">Site</dt><dd>{{ drawerAction.siteName }}</dd></div>
          <div class="flex justify-between"><dt class="text-slate-500">Due</dt><dd>{{ formatDate(drawerAction.dueDate) }}</dd></div>
          <div class="flex justify-between"><dt class="text-slate-500">Source inspection</dt><dd><router-link class="text-primary-600 hover:underline" :to="'/reports/' + drawerAction.sourceInspectionId">{{ drawerAction.sourceInspectionId }}</router-link></dd></div>
          <div v-if="drawerAction.verifiedAt" class="flex justify-between"><dt class="text-slate-500">Verified</dt><dd>{{ formatDate(drawerAction.verifiedAt) }}</dd></div>
        </dl>
        <div class="border-t border-slate-100 pt-3">
          <div class="text-xs uppercase tracking-wide text-slate-500 mb-2">Move to</div>
          <div class="flex flex-wrap gap-2">
            <button v-for="c in columns" :key="c.id" @click="move(drawerAction, c.id)"
              :class="['text-xs px-2.5 py-1 rounded-full border',
                drawerAction.status === c.id ? 'bg-primary-600 text-white border-primary-600' : 'bg-white border-slate-200 hover:bg-slate-50']">
              {{ c.label }}
            </button>
          </div>
        </div>
      </div>
    </Drawer>
  </div>
</template>
