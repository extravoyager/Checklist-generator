<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Card from '../components/ui/Card.vue'
import Badge from '../components/ui/Badge.vue'
import LineChart from '../components/charts/LineChart.vue'
import { useAssetStore } from '../stores/assets'
import { useInspectionStore } from '../stores/inspections'
import { useActionStore } from '../stores/actions'
import { ArrowLeft } from 'lucide-vue-next'
import { formatDate } from '../utils/formatDate'

const route = useRoute()
const router = useRouter()
const assets = useAssetStore()
const inspections = useInspectionStore()
const actions = useActionStore()

const asset = computed(() => assets.findById(route.params.id))
const inspectionsForAsset = computed(() => inspections.list.filter(i => i.siteId === asset.value?.siteId).slice(0, 5))
const openActions = computed(() => actions.list.filter(a => a.siteId === asset.value?.siteId && ['open','in_progress','blocked'].includes(a.status)).slice(0, 8))

const readingsChart = computed(() => {
  if (!asset.value) return { categories: [], series: [] }
  return {
    categories: asset.value.readings.map(r => formatDate(r.date)),
    series: [{ name: 'Hours', data: asset.value.readings.map(r => r.hours) }]
  }
})
</script>

<template>
  <div v-if="asset" class="space-y-4">
    <button class="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1" @click="router.push('/assets')"><ArrowLeft class="w-4 h-4" /> Back to assets</button>
    <div class="flex items-start justify-between flex-wrap gap-3">
      <div>
        <h1 class="text-2xl font-semibold text-slate-800">{{ asset.name }}</h1>
        <p class="text-sm text-slate-500">{{ asset.type }} - {{ assets.siteName(asset.siteId) }} - {{ asset.serial }}</p>
      </div>
      <Badge :color="asset.status === 'in_service' ? 'emerald' : 'red'">{{ asset.status.replace('_',' ') }}</Badge>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card title="Operating hours trend" class="lg:col-span-2">
        <LineChart :categories="readingsChart.categories" :series="readingsChart.series" />
      </Card>
      <Card title="Service info">
        <dl class="text-sm space-y-2">
          <div class="flex justify-between"><dt class="text-slate-500">Last inspection</dt><dd>{{ formatDate(asset.lastInspectionDate) }}</dd></div>
          <div class="flex justify-between"><dt class="text-slate-500">Next service</dt><dd>{{ formatDate(asset.nextServiceDate) }}</dd></div>
          <div class="flex justify-between"><dt class="text-slate-500">Site</dt><dd>{{ assets.siteName(asset.siteId) }}</dd></div>
        </dl>
      </Card>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card title="Recent inspections">
        <ul class="divide-y divide-slate-100 text-sm">
          <li v-for="i in inspectionsForAsset" :key="i.id" class="py-2 flex justify-between">
            <button class="text-left text-slate-700 hover:text-primary-700" @click="router.push('/reports/' + i.id)">{{ i.templateTitle }}</button>
            <span class="text-xs text-slate-500">{{ formatDate(i.startedAt) }}</span>
          </li>
        </ul>
      </Card>
      <Card title="Open actions">
        <ul class="divide-y divide-slate-100 text-sm">
          <li v-for="a in openActions" :key="a.id" class="py-2 flex justify-between">
            <span class="text-slate-700">{{ a.title }}</span>
            <Badge :color="a.priority === 'critical' ? 'red' : a.priority === 'high' ? 'orange' : 'amber'">{{ a.priority }}</Badge>
          </li>
        </ul>
      </Card>
    </div>
  </div>
</template>
