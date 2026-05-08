<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Card from '../components/ui/Card.vue'
import Badge from '../components/ui/Badge.vue'
import Button from '../components/ui/Button.vue'
import BarChart from '../components/charts/BarChart.vue'
import { useInspectionStore } from '../stores/inspections'
import { useTemplateStore } from '../stores/templates'
import { useActionStore } from '../stores/actions'
import { useScoringStore } from '../stores/scoring'
import { useFindingStore } from '../stores/findings'
import { calculateScore, isFailResponse } from '../services/scoringService'
import { Printer, ArrowLeft, ShieldHalf } from 'lucide-vue-next'
import { formatDate } from '../utils/formatDate'

const route = useRoute()
const router = useRouter()
const inspections = useInspectionStore()
const templates = useTemplateStore()
const actions = useActionStore()
const scoring = useScoringStore()
const findings = useFindingStore()

const inspection = computed(() => inspections.findById(route.params.inspectionId))
const template = computed(() => inspection.value ? templates.findById(inspection.value.templateId) : null)
const result = computed(() => template.value ? calculateScore(template.value, inspection.value.responses, scoring.config) : null)
const linkedActions = computed(() => actions.list.filter(a => a.sourceInspectionId === inspection.value?.id))
const linkedFindings = computed(() => findings.list.filter(f => f.sourceInspectionId === inspection.value?.id))

const flagged = computed(() => {
  if (!template.value || !inspection.value) return []
  const out = []
  for (const s of template.value.sections) {
    for (const q of s.questions) {
      const r = inspection.value.responses[q.id]
      if (isFailResponse(q, r)) out.push({ section: s.title, question: q.text, response: r, criticality: q.criticality })
    }
  }
  return out
})

function photosOf(q) {
  const v = inspection.value && inspection.value.responses ? inspection.value.responses[q.id] : null
  return Array.isArray(v) ? v : []
}

function print() { window.print() }
</script>

<template>
  <div v-if="inspection && template && result" class="space-y-4">
    <div class="flex items-start justify-between flex-wrap gap-3 no-print">
      <button class="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1" @click="router.back()"><ArrowLeft class="w-4 h-4" /> Back</button>
      <Button variant="secondary" @click="print"><Printer class="w-4 h-4" /> Print / Save PDF</Button>
    </div>

    <!-- Cover -->
    <Card>
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div class="flex items-center gap-2 text-primary-700"><ShieldHalf class="w-5 h-5" /><span class="text-sm font-semibold">CheckWise EHS</span></div>
          <h1 class="mt-2 text-2xl font-bold text-slate-800">{{ template.title }}</h1>
          <div class="text-sm text-slate-500 mt-1">{{ inspection.siteName }} - {{ inspection.assignedToName }}</div>
          <div class="text-xs text-slate-400 mt-1">Started {{ formatDate(inspection.startedAt) }} - Completed {{ formatDate(inspection.completedAt) }}</div>
        </div>
        <div class="text-right">
          <div class="text-sm text-slate-500">Total score</div>
          <div class="text-5xl font-bold text-slate-800 leading-none">{{ result.totalScore }}<span class="text-2xl">%</span></div>
          <div class="mt-2"><Badge :color="result.scoreBand.color">{{ result.scoreBand.label }}</Badge></div>
        </div>
      </div>
    </Card>

    <!-- Summary -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card><div class="text-xs text-slate-500">Questions answered</div><div class="text-2xl font-semibold mt-1">{{ result.answered }}</div></Card>
      <Card><div class="text-xs text-slate-500">Flagged</div><div class="text-2xl font-semibold text-amber-700 mt-1">{{ result.flaggedCount }}</div></Card>
      <Card><div class="text-xs text-slate-500">Critical failures</div><div class="text-2xl font-semibold text-red-700 mt-1">{{ result.criticalFailures }}</div></Card>
      <Card><div class="text-xs text-slate-500">N/A responses</div><div class="text-2xl font-semibold text-slate-700 mt-1">{{ result.naCount }}</div></Card>
    </div>

    <Card title="Section scores">
      <BarChart :categories="result.sectionScores.map(s => s.title)" :series="[{ name: 'Score', data: result.sectionScores.map(s => s.score || 0) }]" horizontal />
    </Card>

    <Card v-if="flagged.length" title="Flagged responses">
      <ul class="divide-y divide-slate-100 text-sm">
        <li v-for="(f, i) in flagged" :key="i" class="py-2.5 flex items-start gap-3">
          <span :class="['mt-1 w-1.5 h-1.5 rounded-full flex-none', f.criticality === 'critical' ? 'bg-red-600' : 'bg-amber-500']" />
          <div class="flex-1">
            <div class="font-medium text-slate-800">{{ f.question }}</div>
            <div class="text-xs text-slate-500">{{ f.section }} - response: <span class="font-semibold">{{ f.response }}</span></div>
          </div>
          <Badge v-if="f.criticality === 'critical'" color="red">critical</Badge>
        </li>
      </ul>
    </Card>

    <Card v-if="linkedActions.length" title="Actions created">
      <ul class="divide-y divide-slate-100 text-sm">
        <li v-for="a in linkedActions" :key="a.id" class="py-2 flex items-center justify-between">
          <span class="text-slate-800">{{ a.title }}</span>
          <Badge :color="a.priority === 'critical' ? 'red' : a.priority === 'high' ? 'orange' : 'amber'">{{ a.priority }}</Badge>
        </li>
      </ul>
    </Card>

    <Card v-if="linkedFindings.length" title="Findings">
      <ul class="divide-y divide-slate-100 text-sm">
        <li v-for="f in linkedFindings" :key="f.id" class="py-2 flex items-center justify-between">
          <span class="text-slate-800">{{ f.title }}</span>
          <Badge :color="f.severity === 'critical' ? 'red' : 'amber'">{{ f.severity }}</Badge>
        </li>
      </ul>
    </Card>

    <Card title="Full Q&amp;A appendix">
      <div class="space-y-3">
        <div v-for="s in template.sections" :key="s.id">
          <div class="text-sm font-semibold text-slate-800">{{ s.title }}</div>
          <ul class="mt-1 text-xs text-slate-600 divide-y divide-slate-100">
            <li v-for="q in s.questions" :key="q.id" class="py-1.5">
              <div class="flex justify-between gap-3">
                <span>{{ q.text }}</span>
                <span v-if="q.responseType !== 'photo'" class="text-slate-800 font-medium">{{ inspection.responses[q.id] || '-' }}</span>
                <span v-else-if="!photosOf(q).length" class="text-slate-400">no photos</span>
                <span v-else class="text-slate-500">{{ photosOf(q).length }} photo{{ photosOf(q).length === 1 ? '' : 's' }}</span>
              </div>
              <div v-if="q.responseType === 'photo' && photosOf(q).length" class="mt-2 flex flex-wrap gap-2">
                <img v-for="p in photosOf(q)" :key="p.id" :src="p.dataUrl" :alt="p.name"
                  class="w-24 h-24 object-cover rounded-md border border-slate-200" />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  </div>
</template>
