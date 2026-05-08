<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import Badge from '../components/ui/Badge.vue'
import Tabs from '../components/ui/Tabs.vue'
import { useTemplateStore } from '../stores/templates'
import { useToastStore } from '../stores/toast'
import { useScoringStore } from '../stores/scoring'
import { responseTypes, hazardCategories, criticalControls } from '../data/ehsTaxonomy'
import { calculateScore } from '../services/scoringService'
import { Plus, Trash2, ChevronUp, ChevronDown, Save, CheckCircle2 } from 'lucide-vue-next'
import { uid } from '../utils/downloadJson'

const route = useRoute()
const router = useRouter()
const store = useTemplateStore()
const toast = useToastStore()
const scoring = useScoringStore()

const template = ref(null)
const selectedQId = ref(null)
const tab = ref('build')
const tabs = [
  { id: 'build', label: 'Build' },
  { id: 'scoring', label: 'Scoring' },
  { id: 'logic', label: 'Logic' },
  { id: 'preview', label: 'Preview' }
]

function loadTemplate() {
  const tpl = store.findById(route.params.id)
  if (!tpl) {
    toast.error('Template not found')
    router.replace('/templates')
    return
  }
  // If pre-built, force a duplicate
  if (tpl.isPreBuilt) {
    const copy = store.duplicate(tpl.id)
    router.replace('/templates/' + copy.id + '/edit')
    return
  }
  template.value = JSON.parse(JSON.stringify(tpl))
  selectedQId.value = template.value.sections[0]?.questions[0]?.id || null
}
loadTemplate()
watch(() => route.params.id, loadTemplate)

const selectedQuestion = computed({
  get() {
    if (!template.value || !selectedQId.value) return null
    for (const s of template.value.sections) {
      const q = s.questions.find(x => x.id === selectedQId.value)
      if (q) return q
    }
    return null
  },
  set(v) {
    for (const s of template.value.sections) {
      const idx = s.questions.findIndex(x => x.id === selectedQId.value)
      if (idx >= 0) { s.questions[idx] = v; return }
    }
  }
})

function addSection() {
  template.value.sections.push({ id: uid('s'), title: 'New Section', description: '', weight: 1, questions: [] })
}

function addQuestion(section) {
  const q = {
    id: uid('q'), text: 'New question', guidance: '', responseType: 'yes_no_na',
    required: true, criticality: 'standard', criticalControl: null, hazardCategory: null,
    weight: 1, evidenceRequired: false, actionOnFlag: false
  }
  section.questions.push(q)
  selectedQId.value = q.id
}

function removeQuestion(section, q) {
  section.questions = section.questions.filter(x => x.id !== q.id)
  if (selectedQId.value === q.id) selectedQId.value = section.questions[0]?.id || template.value.sections[0]?.questions[0]?.id
}

function removeSection(s) {
  template.value.sections = template.value.sections.filter(x => x.id !== s.id)
}

function move(arr, idx, dir) {
  const t = idx + dir
  if (t < 0 || t >= arr.length) return
  const [it] = arr.splice(idx, 1)
  arr.splice(t, 0, it)
}

function save(publish = false) {
  if (publish) template.value.status = 'published'
  store.save(template.value)
  toast.success(publish ? 'Template published' : 'Draft saved')
}

const previewResponses = ref({})
const livePreviewScore = computed(() => {
  if (!template.value) return null
  return calculateScore(template.value, previewResponses.value, scoring.config)
})
</script>

<template>
  <div v-if="template" class="space-y-4">
    <div class="flex items-start justify-between gap-3 flex-wrap">
      <div class="flex-1 min-w-0">
        <input v-model="template.title" class="text-2xl font-semibold text-slate-800 bg-transparent border-0 focus:ring-2 focus:ring-primary-500 rounded px-1 -mx-1 w-full" />
        <div class="text-xs text-slate-500 mt-1">v{{ template.version }} - {{ template.sections.length }} sections - {{ template.sections.reduce((a,s)=>a+s.questions.length,0) }} questions</div>
      </div>
      <div class="flex items-center gap-2">
        <Badge :color="template.status === 'published' ? 'emerald' : template.status === 'draft' ? 'amber' : 'slate'">{{ template.status }}</Badge>
        <Button variant="secondary" @click="save(false)"><Save class="w-4 h-4" /> Save Draft</Button>
        <Button @click="save(true)"><CheckCircle2 class="w-4 h-4" /> Publish</Button>
      </div>
    </div>

    <Tabs :tabs="tabs" v-model="tab" />

    <div v-if="tab === 'build'" class="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <Card :padded="false" class="lg:col-span-3">
        <div class="p-3 border-b border-slate-100 flex items-center justify-between">
          <h3 class="text-sm font-semibold text-slate-700">Outline</h3>
          <button class="text-primary-600 hover:text-primary-700" @click="addSection"><Plus class="w-4 h-4" /></button>
        </div>
        <div class="p-2 max-h-[70vh] overflow-y-auto thin-scroll">
          <div v-for="(s, si) in template.sections" :key="s.id" class="mb-3">
            <div class="flex items-center gap-1 px-2 py-1.5 rounded bg-slate-50">
              <input v-model="s.title" class="flex-1 text-sm font-medium text-slate-700 bg-transparent focus:outline-none" />
              <button class="text-slate-400 hover:text-slate-600" @click="move(template.sections, si, -1)"><ChevronUp class="w-3.5 h-3.5" /></button>
              <button class="text-slate-400 hover:text-slate-600" @click="move(template.sections, si, 1)"><ChevronDown class="w-3.5 h-3.5" /></button>
              <button class="text-red-400 hover:text-red-600" @click="removeSection(s)"><Trash2 class="w-3.5 h-3.5" /></button>
            </div>
            <ul class="mt-1 space-y-0.5">
              <li v-for="q in s.questions" :key="q.id"
                @click="selectedQId = q.id"
                :class="['text-xs px-2 py-1.5 rounded cursor-pointer truncate flex items-center gap-1',
                  selectedQId === q.id ? 'bg-primary-50 text-primary-800' : 'text-slate-600 hover:bg-slate-50']">
                <span v-if="q.criticality === 'critical'" class="w-1.5 h-1.5 rounded-full bg-red-500 flex-none" />
                <span v-else-if="q.criticality === 'high'" class="w-1.5 h-1.5 rounded-full bg-amber-500 flex-none" />
                <span v-else class="w-1.5 h-1.5 rounded-full bg-slate-300 flex-none" />
                <span class="truncate">{{ q.text || 'Untitled question' }}</span>
              </li>
            </ul>
            <button class="mt-1 text-xs text-primary-600 hover:text-primary-700 px-2" @click="addQuestion(s)">+ Add question</button>
          </div>
        </div>
      </Card>

      <Card class="lg:col-span-6">
        <div v-if="selectedQuestion" class="space-y-3">
          <div>
            <label class="label">Question text</label>
            <input v-model="selectedQuestion.text" class="input text-base" />
          </div>
          <div>
            <label class="label">Guidance / what good looks like</label>
            <textarea v-model="selectedQuestion.guidance" rows="2" class="input" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="label">Response type</label>
              <select v-model="selectedQuestion.responseType" class="input">
                <option v-for="r in responseTypes" :key="r.id" :value="r.id">{{ r.label }}</option>
              </select>
            </div>
            <div>
              <label class="label">Criticality</label>
              <select v-model="selectedQuestion.criticality" class="input">
                <option value="standard">Standard</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label class="label">Hazard category</label>
              <select v-model="selectedQuestion.hazardCategory" class="input">
                <option :value="null">- none -</option>
                <option v-for="h in hazardCategories" :key="h.id" :value="h.id">{{ h.label }}</option>
              </select>
            </div>
            <div>
              <label class="label">Critical control</label>
              <select v-model="selectedQuestion.criticalControl" class="input">
                <option :value="null">- none -</option>
                <option v-for="cc in criticalControls" :key="cc.id" :value="cc.id">{{ cc.label }}</option>
              </select>
            </div>
            <div v-if="['multiple_choice','checkbox'].includes(selectedQuestion.responseType)" class="col-span-2">
              <label class="label">Options (comma separated)</label>
              <input :value="(selectedQuestion.options || []).join(', ')"
                @input="e => selectedQuestion.options = e.target.value.split(',').map(s => s.trim()).filter(Boolean)" class="input" />
            </div>
          </div>
          <div class="flex items-center gap-4 text-sm text-slate-700">
            <label class="flex items-center gap-2"><input type="checkbox" v-model="selectedQuestion.required" /> Required</label>
            <label class="flex items-center gap-2"><input type="checkbox" v-model="selectedQuestion.evidenceRequired" /> Evidence on flag</label>
            <label class="flex items-center gap-2"><input type="checkbox" v-model="selectedQuestion.actionOnFlag" /> Auto-create action</label>
          </div>
        </div>
        <div v-else class="text-sm text-slate-500">Select a question to edit.</div>
      </Card>

      <Card class="lg:col-span-3">
        <h3 class="text-sm font-semibold text-slate-700 mb-3">Properties</h3>
        <div v-if="selectedQuestion" class="space-y-3">
          <div>
            <label class="label">Scoring weight</label>
            <input type="number" min="0" step="0.5" v-model.number="selectedQuestion.weight" class="input" />
          </div>
          <div>
            <label class="label">Score map</label>
            <div class="text-xs text-slate-500 space-y-1">
              <div>Pass / Yes / Safe = full points</div>
              <div>Fail / No / At Risk = 0 points + flag</div>
              <div>N/A = excluded (configurable)</div>
            </div>
          </div>
          <div>
            <label class="label">Flag rules</label>
            <div class="text-xs text-slate-500">Automatically flagged on fail responses. Critical questions cap inspection score.</div>
          </div>
        </div>
      </Card>
    </div>

    <div v-else-if="tab === 'scoring'">
      <Card title="Section weights">
        <div class="space-y-2">
          <div v-for="s in template.sections" :key="s.id" class="flex items-center gap-3">
            <div class="flex-1 text-sm text-slate-700">{{ s.title }}</div>
            <div class="text-xs text-slate-500">{{ s.questions.length }} questions</div>
            <input type="number" min="0" step="0.5" v-model.number="s.weight" class="input w-24" />
          </div>
        </div>
      </Card>
      <Card title="Live preview" class="mt-4">
        <div class="text-sm text-slate-500 mb-3">Total questions in this template: {{ template.sections.reduce((a,s)=>a+s.questions.length,0) }}</div>
        <div class="text-sm text-slate-600">Use the <strong>Preview</strong> tab to test scoring with sample answers.</div>
      </Card>
    </div>

    <div v-else-if="tab === 'logic'">
      <Card title="Conditional logic">
        <p class="text-sm text-slate-500">Show / hide rules and skip-logic are part of the roadmap. Each question already supports
          required toggles, evidence-on-flag, and auto-create-action behaviours.</p>
      </Card>
    </div>

    <div v-else-if="tab === 'preview'" class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card class="lg:col-span-2" :padded="false">
        <div class="p-4 max-h-[70vh] overflow-y-auto thin-scroll space-y-4">
          <div v-for="s in template.sections" :key="s.id">
            <h4 class="text-sm font-semibold text-slate-800 mb-2">{{ s.title }}</h4>
            <div class="space-y-2">
              <div v-for="q in s.questions" :key="q.id" class="border border-slate-100 rounded-lg p-3">
                <div class="text-sm text-slate-800">{{ q.text }}
                  <span v-if="q.criticality === 'critical'" class="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-700">critical</span>
                </div>
                <div class="mt-2">
                  <div v-if="['yes_no_na','pass_fail_na','safe_at_risk_na'].includes(q.responseType)" class="flex gap-2">
                    <button v-for="opt in (q.responseType === 'yes_no_na' ? ['Yes','No','N/A'] : q.responseType === 'pass_fail_na' ? ['Pass','Fail','N/A'] : ['Safe','At Risk','N/A'])"
                      :key="opt" @click="previewResponses[q.id] = opt"
                      :class="['text-xs px-3 py-1.5 rounded-md border', previewResponses[q.id] === opt ? 'bg-primary-600 text-white border-primary-600' : 'bg-white border-slate-200 hover:bg-slate-50']">
                      {{ opt }}
                    </button>
                  </div>
                  <input v-else-if="q.responseType === 'text'" v-model="previewResponses[q.id]" class="input text-sm" />
                  <textarea v-else-if="q.responseType === 'long_text'" v-model="previewResponses[q.id]" rows="2" class="input text-sm" />
                  <input v-else-if="q.responseType === 'number'" type="number" v-model="previewResponses[q.id]" class="input text-sm" />
                  <div v-else class="text-xs text-slate-400">[{{ q.responseType }} input not rendered in preview]</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <Card title="Live score">
        <div v-if="livePreviewScore" class="space-y-2">
          <div class="text-3xl font-bold text-slate-800">{{ livePreviewScore.totalScore }}<span class="text-lg">%</span></div>
          <Badge :color="livePreviewScore.scoreBand.color">{{ livePreviewScore.scoreBand.label }}</Badge>
          <div class="text-xs text-slate-500 mt-2">Flagged: {{ livePreviewScore.flaggedCount }} - Critical fails: {{ livePreviewScore.criticalFailures }}</div>
          <div class="mt-3 space-y-1 text-xs">
            <div v-for="s in livePreviewScore.sectionScores" :key="s.id" class="flex justify-between">
              <span class="truncate text-slate-600">{{ s.title }}</span>
              <span class="font-medium">{{ s.score === null ? '-' : s.score + '%' }}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
