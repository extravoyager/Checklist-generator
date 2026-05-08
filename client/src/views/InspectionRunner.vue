<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '../components/ui/Button.vue'
import Badge from '../components/ui/Badge.vue'
import Drawer from '../components/ui/Drawer.vue'
import Modal from '../components/ui/Modal.vue'
import { useInspectionStore } from '../stores/inspections'
import { useTemplateStore } from '../stores/templates'
import { useScoringStore } from '../stores/scoring'
import { useActionStore } from '../stores/actions'
import { useToastStore } from '../stores/toast'
import { useAuthStore } from '../stores/auth'
import { calculateScore, isFailResponse } from '../services/scoringService'
import { pushQueue, queueLength } from '../services/offlineQueue'
import { ChevronLeft, ChevronRight, Save, CheckCircle2, Flag, Menu, AlertTriangle, ListPlus, Cloud, X } from 'lucide-vue-next'
import { responseTypes } from '../data/ehsTaxonomy'

const route = useRoute()
const router = useRouter()
const inspections = useInspectionStore()
const templates = useTemplateStore()
const scoring = useScoringStore()
const actionStore = useActionStore()
const toast = useToastStore()
const auth = useAuthStore()

const inspection = computed(() => inspections.findById(route.params.id))
const template = computed(() => inspection.value ? templates.findById(inspection.value.templateId) : null)

const flatQuestions = computed(() => {
  if (!template.value) return []
  const out = []
  for (const s of template.value.sections) {
    for (const q of s.questions) out.push({ ...q, sectionId: s.id, sectionTitle: s.title })
  }
  return out
})

const currentIndex = ref(0)
const sectionDrawer = ref(false)
const offlineCount = ref(queueLength())
const showComplete = ref(false)
const actionDraft = ref(null)

onMounted(() => {
  if (!inspection.value) {
    toast.error('Inspection not found')
    router.replace('/inspections')
    return
  }
  // Restore any saved progress from localStorage
  const saved = localStorage.getItem('checkwise.inspection.' + inspection.value.id)
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      inspections.update(inspection.value.id, { responses: parsed })
    } catch { /* noop */ }
  }
})

const currentQuestion = computed(() => flatQuestions.value[currentIndex.value])
const progress = computed(() => flatQuestions.value.length === 0 ? 0 : Math.round((Object.keys(inspection.value.responses || {}).length / flatQuestions.value.length) * 100))

const flaggedCount = computed(() => {
  if (!template.value || !inspection.value) return 0
  let c = 0
  for (const q of flatQuestions.value) {
    const r = inspection.value.responses[q.id]
    if (isFailResponse(q, r)) c++
  }
  return c
})

const missingRequired = computed(() => flatQuestions.value.filter(q => q.required && !inspection.value.responses[q.id]).length)

const liveScore = computed(() => template.value && inspection.value ? calculateScore(template.value, inspection.value.responses, scoring.config) : null)

function setResponse(value) {
  inspections.setResponse(inspection.value.id, currentQuestion.value.id, value)
  // autosave
  localStorage.setItem('checkwise.inspection.' + inspection.value.id, JSON.stringify(inspection.value.responses))
  pushQueue({ type: 'response', inspectionId: inspection.value.id, qid: currentQuestion.value.id, value })
  offlineCount.value = queueLength()
}

function next() { if (currentIndex.value < flatQuestions.value.length - 1) currentIndex.value++ }
function prev() { if (currentIndex.value > 0) currentIndex.value-- }
function jumpToSection(s) { currentIndex.value = flatQuestions.value.findIndex(q => q.sectionId === s.id); sectionDrawer.value = false }

function complete() {
  const result = calculateScore(template.value, inspection.value.responses, scoring.config)
  inspections.complete(inspection.value.id, result)
  showComplete.value = false
  toast.success('Inspection completed - score ' + result.totalScore + '%')
  router.push('/reports/' + inspection.value.id)
}

function isCurrentFlagged() {
  return isFailResponse(currentQuestion.value, inspection.value.responses[currentQuestion.value.id])
}

function quickAction() {
  actionDraft.value = {
    title: 'Address: ' + currentQuestion.value.text,
    priority: 'medium',
    description: '',
    siteId: inspection.value.siteId,
    siteName: inspection.value.siteName,
    sourceInspectionId: inspection.value.id,
    ownerId: auth.user.id,
    ownerName: auth.user.name,
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)
  }
}

function saveAction() {
  actionStore.create({ ...actionDraft.value, dueDate: new Date(actionDraft.value.dueDate).toISOString() })
  toast.success('Action created')
  actionDraft.value = null
}

const responseOptions = computed(() => {
  if (!currentQuestion.value) return []
  switch (currentQuestion.value.responseType) {
    case 'yes_no_na': return ['Yes', 'No', 'N/A']
    case 'pass_fail_na': return ['Pass', 'Fail', 'N/A']
    case 'safe_at_risk_na': return ['Safe', 'At Risk', 'N/A']
    case 'multiple_choice': return currentQuestion.value.options || []
    default: return null
  }
})
</script>

<template>
  <div v-if="inspection && template" class="-m-4 md:-m-6 min-h-[calc(100vh-3.5rem)] flex flex-col bg-slate-50">
    <!-- Sticky top progress -->
    <div class="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 py-2.5">
      <div class="flex items-center gap-3">
        <button class="text-slate-500 p-2" @click="sectionDrawer = true"><Menu class="w-5 h-5" /></button>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-semibold text-slate-800 truncate">{{ template.title }}</div>
          <div class="text-xs text-slate-500">{{ inspection.siteName }} - Q {{ currentIndex + 1 }} / {{ flatQuestions.length }}</div>
        </div>
        <div class="flex items-center gap-2 text-xs">
          <span class="hidden sm:inline-flex items-center gap-1 text-amber-700"><Flag class="w-3.5 h-3.5" /> {{ flaggedCount }}</span>
          <span class="hidden sm:inline-flex items-center gap-1 text-red-700"><AlertTriangle class="w-3.5 h-3.5" /> {{ missingRequired }}</span>
          <span class="hidden md:inline-flex items-center gap-1 text-blue-600"><Cloud class="w-3.5 h-3.5" /> {{ offlineCount }} pending</span>
        </div>
      </div>
      <div class="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div class="h-full bg-primary-600 transition-all" :style="{ width: progress + '%' }" />
      </div>
    </div>

    <div v-if="liveScore?.criticalFailures > 0" class="bg-red-50 border-b border-red-100 px-4 py-2 text-xs text-red-700 flex items-center gap-2">
      <AlertTriangle class="w-4 h-4" />
      {{ liveScore.criticalFailures }} critical control failure{{ liveScore.criticalFailures > 1 ? 's' : '' }} - inspection score will be capped.
    </div>

    <!-- Question card -->
    <div class="flex-1 px-4 py-6 max-w-2xl w-full mx-auto">
      <div v-if="currentQuestion" class="bg-white rounded-2xl shadow-soft border border-slate-100 p-5 sm:p-6">
        <div class="text-xs text-slate-500 uppercase tracking-wide">{{ currentQuestion.sectionTitle }}</div>
        <h2 class="mt-1 text-lg sm:text-xl font-semibold text-slate-800">{{ currentQuestion.text }}</h2>
        <p v-if="currentQuestion.guidance" class="mt-2 text-sm text-slate-500">{{ currentQuestion.guidance }}</p>
        <div class="mt-3 flex flex-wrap gap-2">
          <Badge v-if="currentQuestion.criticality === 'critical'" color="red">Critical</Badge>
          <Badge v-else-if="currentQuestion.criticality === 'high'" color="amber">High</Badge>
          <Badge v-if="currentQuestion.required" color="slate">Required</Badge>
        </div>

        <div class="mt-5">
          <div v-if="responseOptions" class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button v-for="opt in responseOptions" :key="opt"
              @click="setResponse(opt)"
              :class="['px-4 py-3 rounded-xl border text-base font-medium transition-colors',
                inspection.responses[currentQuestion.id] === opt
                  ? (opt === 'No' || opt === 'Fail' || opt === 'At Risk' ? 'bg-red-600 text-white border-red-600'
                    : opt === 'N/A' ? 'bg-slate-700 text-white border-slate-700'
                    : 'bg-emerald-600 text-white border-emerald-600')
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50']">
              {{ opt }}
            </button>
          </div>
          <textarea v-else-if="['long_text','text'].includes(currentQuestion.responseType)"
            :value="inspection.responses[currentQuestion.id] || ''" @input="e => setResponse(e.target.value)"
            :rows="currentQuestion.responseType === 'long_text' ? 4 : 2" class="input" />
          <input v-else-if="currentQuestion.responseType === 'number'" type="number"
            :value="inspection.responses[currentQuestion.id] || ''" @input="e => setResponse(e.target.value)" class="input" />
          <input v-else-if="currentQuestion.responseType === 'date'" type="date"
            :value="inspection.responses[currentQuestion.id] || ''" @input="e => setResponse(e.target.value)" class="input" />
          <input v-else-if="currentQuestion.responseType === 'time'" type="time"
            :value="inspection.responses[currentQuestion.id] || ''" @input="e => setResponse(e.target.value)" class="input" />
          <div v-else-if="currentQuestion.responseType === 'photo'" class="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center text-sm text-slate-500">
            Photo capture (placeholder) <button class="block mt-2 text-primary-600 mx-auto" @click="setResponse('captured-' + Date.now())">Mark photo captured</button>
            <div v-if="inspection.responses[currentQuestion.id]" class="text-xs text-emerald-700 mt-2">Photo recorded</div>
          </div>
          <div v-else-if="currentQuestion.responseType === 'signature'" class="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center text-sm text-slate-500">
            <button class="text-primary-600" @click="setResponse('signed-' + auth.user.name)">Sign as {{ auth.user.name }}</button>
            <div v-if="inspection.responses[currentQuestion.id]" class="text-xs text-emerald-700 mt-2">{{ inspection.responses[currentQuestion.id] }}</div>
          </div>
          <input v-else type="text" :value="inspection.responses[currentQuestion.id] || ''" @input="e => setResponse(e.target.value)" class="input" />
        </div>

        <div v-if="isCurrentFlagged()" class="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
          <div class="flex items-start gap-2">
            <Flag class="w-4 h-4 text-amber-700 flex-none mt-0.5" />
            <div class="flex-1">
              <div class="text-sm font-medium text-amber-800">This response is flagged.</div>
              <div class="text-xs text-amber-700">Create a corrective action right now to keep the team accountable.</div>
            </div>
            <Button size="sm" variant="secondary" @click="quickAction"><ListPlus class="w-4 h-4" /> Action</Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky bottom -->
    <div class="sticky bottom-0 bg-white border-t border-slate-200 p-3 flex items-center gap-2">
      <Button variant="secondary" :disabled="currentIndex === 0" @click="prev"><ChevronLeft class="w-4 h-4" /> Prev</Button>
      <div class="flex-1" />
      <div class="hidden md:flex items-center gap-2 text-xs text-slate-500">
        <span>Score</span>
        <span class="font-semibold text-slate-800">{{ liveScore?.totalScore ?? '-' }}%</span>
        <Badge :color="liveScore?.scoreBand?.color || 'slate'">{{ liveScore?.scoreBand?.label || '' }}</Badge>
      </div>
      <Button variant="secondary" v-if="currentIndex < flatQuestions.length - 1" @click="next">Next <ChevronRight class="w-4 h-4" /></Button>
      <Button v-else variant="success" @click="showComplete = true"><CheckCircle2 class="w-4 h-4" /> Complete</Button>
    </div>

    <Drawer :open="sectionDrawer" title="Sections" side="left" @close="sectionDrawer = false">
      <div class="space-y-2">
        <button v-for="s in template.sections" :key="s.id" @click="jumpToSection(s)"
          class="w-full text-left px-3 py-2.5 rounded-lg border border-slate-100 hover:bg-slate-50">
          <div class="text-sm font-medium text-slate-800">{{ s.title }}</div>
          <div class="text-xs text-slate-500">{{ s.questions.length }} questions</div>
        </button>
      </div>
    </Drawer>

    <Modal :open="showComplete" title="Complete inspection?" @close="showComplete = false">
      <div class="space-y-3">
        <div class="text-sm text-slate-600">You are about to complete this inspection.</div>
        <div class="grid grid-cols-3 gap-3">
          <div class="p-3 rounded-lg bg-slate-50">
            <div class="text-xs text-slate-500">Score</div>
            <div class="text-xl font-semibold">{{ liveScore?.totalScore }}%</div>
          </div>
          <div class="p-3 rounded-lg bg-slate-50">
            <div class="text-xs text-slate-500">Flagged</div>
            <div class="text-xl font-semibold text-amber-700">{{ flaggedCount }}</div>
          </div>
          <div class="p-3 rounded-lg bg-slate-50">
            <div class="text-xs text-slate-500">Critical</div>
            <div class="text-xl font-semibold text-red-700">{{ liveScore?.criticalFailures }}</div>
          </div>
        </div>
        <div v-if="missingRequired > 0" class="text-xs text-amber-700">{{ missingRequired }} required questions are unanswered.</div>
      </div>
      <template #footer>
        <Button variant="secondary" @click="showComplete = false">Cancel</Button>
        <Button variant="success" @click="complete"><CheckCircle2 class="w-4 h-4" /> Complete</Button>
      </template>
    </Modal>

    <Modal :open="!!actionDraft" title="Create corrective action" @close="actionDraft = null">
      <div v-if="actionDraft" class="space-y-3">
        <div>
          <label class="label">Title</label>
          <input v-model="actionDraft.title" class="input" />
        </div>
        <div>
          <label class="label">Description</label>
          <textarea v-model="actionDraft.description" rows="2" class="input" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="label">Priority</label>
            <select v-model="actionDraft.priority" class="input">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label class="label">Due date</label>
            <input type="date" v-model="actionDraft.dueDate" class="input" />
          </div>
        </div>
      </div>
      <template #footer>
        <Button variant="secondary" @click="actionDraft = null">Cancel</Button>
        <Button @click="saveAction">Create</Button>
      </template>
    </Modal>
  </div>
</template>
