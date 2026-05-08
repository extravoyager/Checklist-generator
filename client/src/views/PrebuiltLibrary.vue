<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import Badge from '../components/ui/Badge.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import Modal from '../components/ui/Modal.vue'
import { useTemplateStore } from '../stores/templates'
import { useToastStore } from '../stores/toast'
import { hazardCategories } from '../data/ehsTaxonomy'
import { Search, Copy, Eye, Library } from 'lucide-vue-next'

const router = useRouter()
const store = useTemplateStore()
const toast = useToastStore()

const search = ref('')
const categoryFilter = ref('all')
const previewing = ref(null)

const categories = computed(() => Array.from(new Set(store.prebuilt.map(t => t.category))))

const filtered = computed(() => store.prebuilt.filter(t => {
  if (categoryFilter.value !== 'all' && t.category !== categoryFilter.value) return false
  if (search.value && !t.title.toLowerCase().includes(search.value.toLowerCase())) return false
  return true
}))

function tagLabel(id) { return hazardCategories.find(h => h.id === id)?.label || id }

function customize(t) {
  const copy = store.duplicate(t.id)
  toast.success('Copied to your drafts. Customize away.')
  router.push('/templates/' + copy.id + '/edit')
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <h1 class="text-2xl font-semibold text-slate-800">Pre-built Library</h1>
      <p class="text-sm text-slate-500">{{ store.prebuilt.length }} curated checklists. Originals are locked - duplicate to customize.</p>
    </div>

    <Card :padded="false">
      <div class="p-4 flex flex-wrap items-center gap-3 border-b border-slate-100">
        <div class="relative flex-1 min-w-[180px]">
          <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input v-model="search" placeholder="Search pre-built" class="input pl-9" />
        </div>
        <select v-model="categoryFilter" class="input max-w-[200px]">
          <option value="all">All categories</option>
          <option v-for="c in categories" :key="c">{{ c }}</option>
        </select>
      </div>

      <div v-if="filtered.length === 0" class="p-6">
        <EmptyState title="No matches" description="Try a different category or search term." :icon="Library" />
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
        <div v-for="t in filtered" :key="t.id" class="border border-slate-100 rounded-xl p-4 bg-white hover:shadow-soft transition-shadow flex flex-col">
          <div class="flex items-start justify-between gap-2">
            <h3 class="font-semibold text-slate-800 text-sm leading-snug">{{ t.title }}</h3>
            <Badge color="purple">Pre-built</Badge>
          </div>
          <p class="text-xs text-slate-500 mt-1">{{ t.category }}</p>
          <div class="mt-3 flex items-center gap-3 text-xs text-slate-500">
            <span>{{ t.sectionCount }} sections</span>
            <span class="w-1 h-1 rounded-full bg-slate-300" />
            <span>{{ t.questionCount }} questions</span>
          </div>
          <div class="mt-2 flex flex-wrap gap-1">
            <span v-for="rt in (t.riskTags || []).slice(0, 3)" :key="rt"
              class="text-[10px] px-2 py-0.5 rounded-full border border-slate-200 text-slate-600">{{ tagLabel(rt) }}</span>
          </div>
          <div class="mt-auto pt-3 flex items-center justify-end gap-1">
            <button class="p-1.5 rounded-md hover:bg-slate-100 text-slate-500" @click="previewing = t" title="Preview"><Eye class="w-4 h-4" /></button>
            <Button size="sm" variant="secondary" @click="customize(t)"><Copy class="w-4 h-4" /> Customize</Button>
          </div>
        </div>
      </div>
    </Card>

    <Modal :open="!!previewing" :title="previewing?.title" size="lg" @close="previewing = null">
      <div v-if="previewing" class="space-y-3">
        <div class="text-sm text-slate-600">{{ previewing.description }}</div>
        <div v-for="s in previewing.sections" :key="s.id" class="border border-slate-100 rounded-lg p-3">
          <div class="text-sm font-semibold text-slate-800">{{ s.title }}</div>
          <ol class="mt-2 list-decimal list-inside text-xs text-slate-600 space-y-1">
            <li v-for="q in s.questions" :key="q.id">
              {{ q.text }}
              <span v-if="q.criticality === 'critical'" class="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-100">critical</span>
            </li>
          </ol>
        </div>
      </div>
      <template #footer>
        <Button variant="secondary" @click="previewing = null">Close</Button>
        <Button @click="customize(previewing)"><Copy class="w-4 h-4" /> Customize</Button>
      </template>
    </Modal>
  </div>
</template>
