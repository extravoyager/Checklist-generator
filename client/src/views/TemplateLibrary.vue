<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import Badge from '../components/ui/Badge.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import { useTemplateStore } from '../stores/templates'
import { useToastStore } from '../stores/toast'
import { useAuthStore } from '../stores/auth'
import { hazardCategories } from '../data/ehsTaxonomy'
import { Search, Copy, Edit, Eye, Archive as ArchiveIcon, CheckCircle2, FileStack } from 'lucide-vue-next'
import { formatDate } from '../utils/formatDate'

const router = useRouter()
const store = useTemplateStore()
const toast = useToastStore()
const auth = useAuthStore()

const search = ref('')
const statusFilter = ref('all')
const categoryFilter = ref('all')

const allCategories = computed(() => Array.from(new Set(store.custom.map(t => t.category))))

const filtered = computed(() => store.custom.filter(t => {
  if (statusFilter.value !== 'all' && t.status !== statusFilter.value) return false
  if (categoryFilter.value !== 'all' && t.category !== categoryFilter.value) return false
  if (search.value && !t.title.toLowerCase().includes(search.value.toLowerCase())) return false
  return true
}))

function statusColor(s) { return { draft: 'amber', published: 'emerald', archived: 'slate' }[s] || 'slate' }

function tagLabel(id) { return hazardCategories.find(h => h.id === id)?.label || id }

function duplicate(t) { const copy = store.duplicate(t.id); toast.success('Duplicated as draft'); router.push('/templates/' + copy.id + '/edit') }
function publish(t) { store.publish(t.id); toast.success('Published') }
function archive(t) { store.archive(t.id); toast.info('Archived') }
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-start justify-between flex-wrap gap-3">
      <div>
        <h1 class="text-2xl font-semibold text-slate-800">Template Library</h1>
        <p class="text-sm text-slate-500">{{ filtered.length }} of {{ store.custom.length }} templates</p>
      </div>
      <Button v-if="auth.can('template.create')" @click="router.push('/generator')">New Template</Button>
    </div>

    <Card :padded="false">
      <div class="p-4 flex flex-wrap items-center gap-3 border-b border-slate-100">
        <div class="relative flex-1 min-w-[180px]">
          <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input v-model="search" placeholder="Search templates" class="input pl-9" />
        </div>
        <select v-model="statusFilter" class="input max-w-[160px]">
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <select v-model="categoryFilter" class="input max-w-[200px]">
          <option value="all">All categories</option>
          <option v-for="c in allCategories" :key="c">{{ c }}</option>
        </select>
      </div>

      <div v-if="filtered.length === 0" class="p-6">
        <EmptyState title="No templates found" description="Adjust filters or create a new template." :icon="FileStack" />
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
        <div v-for="t in filtered" :key="t.id" class="border border-slate-100 rounded-xl p-4 bg-white hover:shadow-soft transition-shadow flex flex-col">
          <div class="flex items-start justify-between gap-2">
            <h3 class="font-semibold text-slate-800 text-sm leading-snug">{{ t.title }}</h3>
            <Badge :color="statusColor(t.status)">{{ t.status }}</Badge>
          </div>
          <p class="text-xs text-slate-500 mt-1">{{ t.category }} - v{{ t.version }}</p>
          <div class="mt-3 flex items-center gap-3 text-xs text-slate-500">
            <span>{{ t.sectionCount }} sections</span>
            <span class="w-1 h-1 rounded-full bg-slate-300" />
            <span>{{ t.questionCount }} questions</span>
          </div>
          <div class="mt-2 flex flex-wrap gap-1">
            <span v-for="rt in (t.riskTags || []).slice(0, 3)" :key="rt"
              class="text-[10px] px-2 py-0.5 rounded-full border border-slate-200 text-slate-600">{{ tagLabel(rt) }}</span>
          </div>
          <div class="mt-auto pt-3 flex items-center justify-between">
            <span class="text-[11px] text-slate-400">Updated {{ formatDate(t.updatedAt) }}</span>
            <div class="flex gap-1">
              <button class="p-1.5 rounded-md hover:bg-slate-100 text-slate-500" @click="router.push('/templates/' + t.id + '/edit')" title="Edit"><Edit class="w-4 h-4" /></button>
              <button class="p-1.5 rounded-md hover:bg-slate-100 text-slate-500" @click="duplicate(t)" title="Duplicate"><Copy class="w-4 h-4" /></button>
              <button v-if="t.status === 'draft' && auth.can('template.publish')" class="p-1.5 rounded-md hover:bg-emerald-50 text-emerald-600" @click="publish(t)" title="Publish"><CheckCircle2 class="w-4 h-4" /></button>
              <button v-if="t.status !== 'archived'" class="p-1.5 rounded-md hover:bg-slate-100 text-slate-500" @click="archive(t)" title="Archive"><ArchiveIcon class="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>
