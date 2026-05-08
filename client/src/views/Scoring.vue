<script setup>
import { computed, ref } from 'vue'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import Badge from '../components/ui/Badge.vue'
import { useScoringStore } from '../stores/scoring'
import { useToastStore } from '../stores/toast'
import { calculateScore } from '../services/scoringService'

const scoring = useScoringStore()
const toast = useToastStore()

function update(key, val) { scoring.update({ [key]: val }) }

// Sample template + responses for live preview
const sample = {
  sections: [
    { id: 's1', title: 'Documentation', weight: 1, questions: [
      { id: 'q1', text: 'Permit valid?', responseType: 'yes_no_na', criticality: 'critical', weight: 1 },
      { id: 'q2', text: 'JSA reviewed?', responseType: 'yes_no_na', criticality: 'high', weight: 1 }
    ]},
    { id: 's2', title: 'Field controls', weight: 2, questions: [
      { id: 'q3', text: 'Edge protection in place?', responseType: 'yes_no_na', criticality: 'high', weight: 2 },
      { id: 'q4', text: 'Harness inspected?', responseType: 'yes_no_na', criticality: 'standard', weight: 1 },
      { id: 'q5', text: 'Drop zone barricaded?', responseType: 'yes_no_na', criticality: 'standard', weight: 1 }
    ]}
  ]
}

const sampleResponses = ref({ q1: 'Yes', q2: 'Yes', q3: 'No', q4: 'Yes', q5: 'N/A' })
const result = computed(() => calculateScore(sample, sampleResponses.value, scoring.config))

function setSample(qid, val) { sampleResponses.value[qid] = val }
</script>

<template>
  <div class="space-y-4">
    <div>
      <h1 class="text-2xl font-semibold text-slate-800">Scoring Settings</h1>
      <p class="text-sm text-slate-500">Configure how inspection scores are calculated, banded, and capped.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card title="Method &amp; thresholds">
        <div class="space-y-3">
          <div>
            <label class="label">Scoring method</label>
            <select :value="scoring.config.method" @change="e => update('method', e.target.value)" class="input">
              <option value="simple_percentage">Simple percentage</option>
              <option value="weighted_section">Weighted by section</option>
              <option value="weighted_question">Weighted by question</option>
              <option value="deduction">Deduction (start at 100)</option>
            </select>
          </div>
          <div>
            <label class="label">Pass threshold</label>
            <input type="number" :value="scoring.config.passThreshold" @input="e => update('passThreshold', +e.target.value)" class="input" />
          </div>
          <div>
            <label class="label">N/A treatment</label>
            <select :value="scoring.config.naTreatment" @change="e => update('naTreatment', e.target.value)" class="input">
              <option value="exclude">Exclude (don't count)</option>
              <option value="neutral">Neutral (full points)</option>
            </select>
          </div>
          <div>
            <label class="label">Critical failure mode</label>
            <select :value="scoring.config.criticalFailureMode" @change="e => update('criticalFailureMode', e.target.value)" class="input">
              <option value="cap">Cap score</option>
              <option value="flag">Flag inspection as Critical Failure</option>
            </select>
          </div>
          <div v-if="scoring.config.criticalFailureMode === 'cap'">
            <label class="label">Critical failure cap (%)</label>
            <input type="number" :value="scoring.config.criticalFailureCap" @input="e => update('criticalFailureCap', +e.target.value)" class="input" />
          </div>
          <Button variant="secondary" @click="() => { scoring.reset(); toast.info('Reset to defaults') }">Reset to defaults</Button>
        </div>
      </Card>

      <Card title="Score bands">
        <div class="space-y-2">
          <div v-for="b in scoring.config.bands" :key="b.id" class="flex items-center gap-2">
            <Badge :color="b.color">{{ b.label }}</Badge>
            <input type="number" :value="b.min" @input="e => { b.min = +e.target.value; scoring.update({ bands: [...scoring.config.bands] }) }" class="input w-20" />
            <span class="text-xs text-slate-500">to</span>
            <input type="number" :value="b.max" @input="e => { b.max = +e.target.value; scoring.update({ bands: [...scoring.config.bands] }) }" class="input w-20" />
          </div>
        </div>
      </Card>

      <Card title="Live preview">
        <div class="space-y-3">
          <div class="text-xs text-slate-500">Sample template - edit answers to see scoring change.</div>
          <div v-for="s in sample.sections" :key="s.id">
            <div class="text-xs font-semibold text-slate-700 mb-1">{{ s.title }}</div>
            <div v-for="q in s.questions" :key="q.id" class="flex items-center justify-between text-xs py-1">
              <span class="text-slate-600 truncate flex-1">{{ q.text }}</span>
              <select :value="sampleResponses[q.id]" @change="e => setSample(q.id, e.target.value)" class="input w-24 ml-2 py-1 text-xs">
                <option>Yes</option><option>No</option><option>N/A</option>
              </select>
            </div>
          </div>
          <div class="border-t border-slate-100 pt-3 flex items-center justify-between">
            <div>
              <div class="text-xs text-slate-500">Score</div>
              <div class="text-2xl font-semibold">{{ result.totalScore }}%</div>
            </div>
            <Badge :color="result.scoreBand.color">{{ result.scoreBand.label }}</Badge>
          </div>
          <div class="text-xs text-slate-500">Flagged: {{ result.flaggedCount }} - Critical fails: {{ result.criticalFailures }}</div>
        </div>
      </Card>
    </div>
  </div>
</template>
