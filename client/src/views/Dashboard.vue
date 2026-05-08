<script setup>
import { computed } from 'vue'
import Card from '../components/ui/Card.vue'
import Badge from '../components/ui/Badge.vue'
import LineChart from '../components/charts/LineChart.vue'
import BarChart from '../components/charts/BarChart.vue'
import DonutChart from '../components/charts/DonutChart.vue'
import { useInspectionStore } from '../stores/inspections'
import { useActionStore } from '../stores/actions'
import { dashboardKpis, sites, hazardCategories } from '../data/seedData'
import { ClipboardList, ListTodo, AlertTriangle, ShieldAlert, TrendingUp, CheckCircle2, Clock } from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const inspections = useInspectionStore()
const actions = useActionStore()

const kpis = computed(() => ({
  due: dashboardKpis.inspectionsDue,
  inProgress: inspections.list.filter(i => i.status === 'in_progress').length,
  completedThisWeek: dashboardKpis.completedThisWeek,
  open: actions.list.filter(a => ['open','in_progress','blocked'].includes(a.status)).length,
  overdue: actions.list.filter(a => ['open','in_progress','blocked'].includes(a.status) && new Date(a.dueDate) < new Date()).length,
  avg: dashboardKpis.avgScore,
  critical: inspections.list.filter(i => i.status === 'critical_failure').length
}))

const trendCategories = ['W-7','W-6','W-5','W-4','W-3','W-2','W-1','This']
const trendSeries = [{ name: 'Completed', data: [12, 15, 18, 22, 19, 24, 28, 22] }, { name: 'Started', data: [16, 18, 22, 25, 22, 28, 31, 26] }]

const findingCategories = computed(() => {
  const top = hazardCategories.slice(0, 6)
  return { categories: top.map(c => c.label), data: top.map((c, i) => 8 + i * 4 + (i % 3) * 2) }
})

const actionDonut = computed(() => {
  const counts = ['open','in_progress','blocked','completed','verified'].map(s => ({
    name: s.replace('_',' '), value: actions.list.filter(a => a.status === s).length
  }))
  return counts
})

const siteScores = computed(() => ({
  categories: sites.map(s => s.name.split(' ')[0]),
  data: [82, 76, 91, 64, 88, 79]
}))
</script>

<template>
  <div class="space-y-5">
    <div>
      <h1 class="text-2xl font-semibold text-slate-800">Welcome, {{ auth.user?.name?.split(' ')[0] }}</h1>
      <p class="text-sm text-slate-500">Here is what's happening across your sites today.</p>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <div class="flex items-start justify-between">
          <div>
            <div class="text-xs text-slate-500">Due this week</div>
            <div class="text-2xl font-semibold text-slate-800 mt-1">{{ kpis.due }}</div>
          </div>
          <Clock class="w-5 h-5 text-amber-500" />
        </div>
        <div class="text-xs text-slate-500 mt-3">Inspections scheduled to be completed</div>
      </Card>
      <Card>
        <div class="flex items-start justify-between">
          <div>
            <div class="text-xs text-slate-500">In progress</div>
            <div class="text-2xl font-semibold text-slate-800 mt-1">{{ kpis.inProgress }}</div>
          </div>
          <ClipboardList class="w-5 h-5 text-primary-600" />
        </div>
        <div class="text-xs text-slate-500 mt-3">Inspections currently being conducted</div>
      </Card>
      <Card>
        <div class="flex items-start justify-between">
          <div>
            <div class="text-xs text-slate-500">Completed this week</div>
            <div class="text-2xl font-semibold text-slate-800 mt-1">{{ kpis.completedThisWeek }}</div>
          </div>
          <CheckCircle2 class="w-5 h-5 text-emerald-600" />
        </div>
        <div class="text-xs text-slate-500 mt-3">+18% vs prior week</div>
      </Card>
      <Card>
        <div class="flex items-start justify-between">
          <div>
            <div class="text-xs text-slate-500">Open actions</div>
            <div class="text-2xl font-semibold text-slate-800 mt-1">{{ kpis.open }}</div>
          </div>
          <ListTodo class="w-5 h-5 text-primary-600" />
        </div>
        <div class="text-xs mt-3"><Badge color="red">{{ kpis.overdue }} overdue</Badge></div>
      </Card>
      <Card>
        <div class="flex items-start justify-between">
          <div>
            <div class="text-xs text-slate-500">Average score</div>
            <div class="text-2xl font-semibold text-slate-800 mt-1">{{ kpis.avg }}<span class="text-sm">%</span></div>
          </div>
          <TrendingUp class="w-5 h-5 text-emerald-600" />
        </div>
        <div class="text-xs text-slate-500 mt-3">Trailing 30 days</div>
      </Card>
      <Card>
        <div class="flex items-start justify-between">
          <div>
            <div class="text-xs text-slate-500">Critical failures</div>
            <div class="text-2xl font-semibold text-critical-700 mt-1">{{ kpis.critical }}</div>
          </div>
          <ShieldAlert class="w-5 h-5 text-critical-600" />
        </div>
        <div class="text-xs text-slate-500 mt-3">Inspections with critical control failure</div>
      </Card>
      <Card>
        <div class="flex items-start justify-between">
          <div>
            <div class="text-xs text-slate-500">Overdue actions</div>
            <div class="text-2xl font-semibold text-amber-700 mt-1">{{ kpis.overdue }}</div>
          </div>
          <AlertTriangle class="w-5 h-5 text-amber-600" />
        </div>
        <div class="text-xs text-slate-500 mt-3">Past due date</div>
      </Card>
      <Card>
        <div class="flex items-start justify-between">
          <div>
            <div class="text-xs text-slate-500">Sites covered</div>
            <div class="text-2xl font-semibold text-slate-800 mt-1">6</div>
          </div>
          <ShieldAlert class="w-5 h-5 text-primary-600" />
        </div>
        <div class="text-xs text-slate-500 mt-3">Across 3 regions</div>
      </Card>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card title="Inspection completion trend">
        <LineChart :categories="trendCategories" :series="trendSeries" />
      </Card>
      <Card title="Findings by category">
        <BarChart :categories="findingCategories.categories" :series="[{ name: 'Findings', data: findingCategories.data }]" horizontal />
      </Card>
      <Card title="Actions by status">
        <DonutChart :data="actionDonut" />
      </Card>
      <Card title="Average score by site">
        <BarChart :categories="siteScores.categories" :series="[{ name: 'Score', data: siteScores.data }]" />
      </Card>
    </div>
  </div>
</template>
