<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import Badge from '../components/ui/Badge.vue'
import Modal from '../components/ui/Modal.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import { useInspectionStore } from '../stores/inspections'
import { useTemplateStore } from '../stores/templates'
import { useAuthStore } from '../stores/auth'
import { sites, users } from '../data/seedData'
import { ClipboardList, Play, Eye } from 'lucide-vue-next'
import { formatDate, daysFromNow } from '../utils/formatDate'

const router = useRouter()
const store = useInspectionStore()
const templates = useTemplateStore()
const auth = useAuthStore()

const statusFilter = ref('all')
const siteFilter = ref('all')

const filtered = computed(() => store.list.filter(i => {
  if (statusFilter.value !== 'all' && i.status !== statusFilter.value) return false
  if (siteFilter.value !== 'all' && i.siteId !== siteFilter.value) return false
  return true
}))

function statusColor(s) {
  return { in_progress: 'blue', completed: 'emerald', pending_approval: 'amber', critical_failure: 'red' }[s] || 'slate'
}

const showStart = ref(false)
const startForm = ref({ templateId: '', siteId: sites[0].id, dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0,10) })
const publishedTemplates = computed(() => [...templates.custom.filter(t => t.status === 'published'), ...templates.prebuilt])

function openStart() {
  startForm.value.templateId = publishedTemplates.value[0]?.id || ''
  showStart.value = true
}

function startInspection() {
  const tpl = templates.findById(startForm.value.templateId)
  const site = sites.find(s => s.id === startForm.value.siteId)
  if (!tpl || !site) return
  const ins = store.create({
    templateId: tpl.id,
    templateTitle: tpl.title,
    siteId: site.id,
    siteName: site.name,
    assignedTo: auth.user.id,
    assignedToName: auth.user.name,
    dueDate: new Date(startForm.value.dueDate).toISOString()
  })
  showStart.value = false
  router.push('/inspections/' + ins.id + '/run')
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-start justify-between flex-wrap gap-3">
      <div>
        <h1 class="text-2xl font-semibold text-slate-800">Inspections</h1>
        <p class="text-sm text-slate-500">{{ filtered.length }} inspections</p>
      </div>
      <Button v-if="auth.can('inspection.create')" @click="openStart"><Play class="w-4 h-4" /> Start Inspection</Button>
    </div>

    <Card :padded="false">
      <div class="p-4 flex flex-wrap items-center gap-3 border-b border-slate-100">
        <select v-model="statusFilter" class="input max-w-[200px]">
          <option value="all">All statuses</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="pending_approval">Pending Approval</option>
          <option value="critical_failure">Critical Failure</option>
        </select>
        <select v-model="siteFilter" class="input max-w-[200px]">
          <option value="all">All sites</option>
          <option v-for="s in sites" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
      </div>

      <div v-if="filtered.length === 0" class="p-6">
        <EmptyState title="No inspections" :icon="ClipboardList" description="Start your first inspection." />
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th class="text-left px-4 py-2.5">Template</th>
              <th class="text-left px-4 py-2.5">Site</th>
              <th class="text-left px-4 py-2.5">Assigned to</th>
              <th class="text-left px-4 py-2.5">Status</th>
              <th class="text-left px-4 py-2.5">Score</th>
              <th class="text-left px-4 py-2.5">Due</th>
              <th class="text-right px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="i in filtered" :key="i.id" class="hover:bg-slate-50/50">
              <td class="px-4 py-3 text-slate-800 font-medium">{{ i.templateTitle }}<div class="text-xs text-slate-500">{{ i.id }}</div></td>
              <td class="px-4 py-3 text-slate-600">{{ i.siteName }}</td>
              <td class="px-4 py-3 text-slate-600">{{ i.assignedToName }}</td>
              <td class="px-4 py-3"><Badge :color="statusColor(i.status)">{{ i.status.replace('_',' ') }}</Badge></td>
              <td class="px-4 py-3 text-slate-600">{{ i.score !== null ? i.score + '%' : '-' }}</td>
              <td class="px-4 py-3 text-slate-600">{{ formatDate(i.dueDate) }}<div class="text-xs"
                :class="daysFromNow(i.dueDate) < 0 ? 'text-red-600' : 'text-slate-400'">
                {{ daysFromNow(i.dueDate) >= 0 ? 'in ' + daysFromNow(i.dueDate) + 'd' : Math.abs(daysFromNow(i.dueDate)) + 'd overdue' }}</div></td>
              <td class="px-4 py-3 text-right">
                <button v-if="i.status === 'in_progress'" class="text-primary-600 hover:text-primary-700 mr-2" @click="router.push('/inspections/' + i.id + '/run')">Resume</button>
                <button class="text-slate-500 hover:text-slate-700" @click="router.push('/reports/' + i.id)" title="View report"><Eye class="w-4 h-4 inline" /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>

    <Modal :open="showStart" title="Start a new inspection" @close="showStart = false">
      <div class="space-y-3">
        <div>
          <label class="label">Template</label>
          <select v-model="startForm.templateId" class="input">
            <option v-for="t in publishedTemplates" :key="t.id" :value="t.id">{{ t.title }}</option>
          </select>
        </div>
        <div>
          <label class="label">Site</label>
          <select v-model="startForm.siteId" class="input">
            <option v-for="s in sites" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </div>
        <div>
          <label class="label">Due date</label>
          <input type="date" v-model="startForm.dueDate" class="input" />
        </div>
      </div>
      <template #footer>
        <Button variant="secondary" @click="showStart = false">Cancel</Button>
        <Button @click="startInspection"><Play class="w-4 h-4" /> Start</Button>
      </template>
    </Modal>
  </div>
</template>
