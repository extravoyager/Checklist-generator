<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import Badge from '../components/ui/Badge.vue'
import { hazardCategories, criticalControls, industries, siteTypes } from '../data/ehsTaxonomy'
import { generateChecklist } from '../services/generatorService'
import { aiAvailable } from '../services/aiAdapter'
import { useTemplateStore } from '../stores/templates'
import { useToastStore } from '../stores/toast'
import { Sparkles, Wand2 } from 'lucide-vue-next'

const router = useRouter()
const templateStore = useTemplateStore()
const toast = useToastStore()

const form = ref({
  title: '',
  industry: industries[0],
  siteType: siteTypes[0],
  objective: '',
  riskFocus: ['housekeeping', 'ppe'],
  criticalControls: [],
  depth: 'Standard',
  sections: 0,
  questionsPerSection: 0,
  scoringOn: true,
  evidenceRequired: false,
  autoActions: true
})

const filteredCriticalControls = computed(() => {
  if (!form.value.riskFocus.length) return criticalControls
  return criticalControls.filter(cc => form.value.riskFocus.includes(cc.hazardId))
})

function toggleArr(arr, val) {
  const i = arr.indexOf(val)
  if (i >= 0) arr.splice(i, 1)
  else arr.push(val)
}

function preview() {
  const t = generateChecklist({
    ...form.value,
    sections: form.value.sections || null,
    questionsPerSection: form.value.questionsPerSection || null
  })
  return t
}

const previewedTemplate = ref(null)
function doPreview() { previewedTemplate.value = preview() }

function generateAndOpen() {
  const t = preview()
  const saved = templateStore.create(t)
  toast.success('Template generated. Opening builder.')
  router.push('/templates/' + saved.id + '/edit')
}
</script>

<template>
  <div class="space-y-5">
    <div class="flex items-start justify-between flex-wrap gap-3">
      <div>
        <h1 class="text-2xl font-semibold text-slate-800 flex items-center gap-2">
          <Sparkles class="w-6 h-6 text-primary-600" />
          Checklist Generator
        </h1>
        <p class="text-sm text-slate-500">Describe the inspection goals and risks; we will assemble a tailored draft template.</p>
      </div>
      <Badge :color="aiAvailable ? 'emerald' : 'slate'">
        {{ aiAvailable ? 'AI assist enabled' : 'Deterministic generator' }}
      </Badge>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <Card class="lg:col-span-2">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="sm:col-span-2">
            <label class="label">Title</label>
            <input class="input" v-model="form.title" placeholder="e.g. Substation Maintenance Pre-Task Inspection" />
          </div>
          <div>
            <label class="label">Industry</label>
            <select class="input" v-model="form.industry">
              <option v-for="i in industries" :key="i">{{ i }}</option>
            </select>
          </div>
          <div>
            <label class="label">Site type</label>
            <select class="input" v-model="form.siteType">
              <option v-for="s in siteTypes" :key="s">{{ s }}</option>
            </select>
          </div>
          <div class="sm:col-span-2">
            <label class="label">Objective</label>
            <textarea class="input" rows="2" v-model="form.objective" placeholder="What does this inspection aim to verify?" />
          </div>

          <div class="sm:col-span-2">
            <label class="label">Risk focus</label>
            <div class="flex flex-wrap gap-2">
              <button v-for="h in hazardCategories" :key="h.id" type="button" @click="toggleArr(form.riskFocus, h.id)"
                :class="['text-xs px-2.5 py-1 rounded-full border',
                  form.riskFocus.includes(h.id) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50']">
                {{ h.label }}
              </button>
            </div>
          </div>

          <div class="sm:col-span-2">
            <label class="label">Critical controls</label>
            <div class="flex flex-wrap gap-2">
              <button v-for="cc in filteredCriticalControls" :key="cc.id" type="button" @click="toggleArr(form.criticalControls, cc.id)"
                :class="['text-xs px-2.5 py-1 rounded-full border',
                  form.criticalControls.includes(cc.id) ? 'bg-critical-600 text-white border-critical-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50']">
                {{ cc.label }}
              </button>
            </div>
          </div>

          <div>
            <label class="label">Depth</label>
            <select class="input" v-model="form.depth">
              <option>Basic</option><option>Standard</option><option>Advanced</option>
            </select>
          </div>
          <div>
            <label class="label">Sections (0 = auto)</label>
            <input type="number" class="input" v-model.number="form.sections" min="0" max="12" />
          </div>
          <div>
            <label class="label">Questions / section (0 = auto)</label>
            <input type="number" class="input" v-model.number="form.questionsPerSection" min="0" max="20" />
          </div>
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" v-model="form.scoringOn" /> Scoring enabled</label>
            <label class="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" v-model="form.evidenceRequired" /> Require evidence</label>
            <label class="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" v-model="form.autoActions" /> Auto-create actions on flag</label>
          </div>
        </div>

        <div class="mt-5 flex flex-wrap gap-2">
          <Button variant="secondary" @click="doPreview"><Wand2 class="w-4 h-4" /> Preview</Button>
          <Button @click="generateAndOpen"><Sparkles class="w-4 h-4" /> Generate &amp; edit</Button>
        </div>
      </Card>

      <Card title="Preview" :padded="true">
        <div v-if="!previewedTemplate" class="text-sm text-slate-500">
          Click <strong>Preview</strong> to see a deterministic draft. The output is fully editable in Template Builder.
        </div>
        <div v-else class="space-y-3">
          <div class="text-sm">
            <div class="font-semibold text-slate-800">{{ previewedTemplate.title || 'Untitled' }}</div>
            <div class="text-xs text-slate-500">{{ previewedTemplate.sectionCount }} sections - {{ previewedTemplate.questionCount }} questions</div>
          </div>
          <div class="space-y-2 max-h-72 overflow-y-auto thin-scroll pr-1">
            <div v-for="s in previewedTemplate.sections" :key="s.id" class="border border-slate-100 rounded-lg p-3">
              <div class="text-sm font-medium text-slate-800">{{ s.title }}</div>
              <ul class="mt-1.5 text-xs text-slate-600 space-y-1">
                <li v-for="q in s.questions" :key="q.id" class="flex items-start gap-2">
                  <span class="w-1 h-1 rounded-full bg-slate-400 mt-1.5 flex-none" />
                  <span>{{ q.text }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
