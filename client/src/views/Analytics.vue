<script setup>
import { computed } from 'vue'
import Card from '../components/ui/Card.vue'
import LineChart from '../components/charts/LineChart.vue'
import BarChart from '../components/charts/BarChart.vue'
import DonutChart from '../components/charts/DonutChart.vue'
import HeatmapChart from '../components/charts/HeatmapChart.vue'
import { useInspectionStore } from '../stores/inspections'
import { useActionStore } from '../stores/actions'
import { sites, hazardCategories } from '../data/seedData'

const inspections = useInspectionStore()
const actions = useActionStore()

const volume = {
  categories: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
  series: [{ name: 'Inspections', data: [42, 51, 48, 60, 72, 65, 80] }]
}

const scoreBySite = {
  categories: sites.map(s => s.name.split(' ')[0]),
  series: [{ name: 'Score', data: [82, 76, 91, 64, 88, 79] }]
}

const findingsByCategory = computed(() => ({
  categories: hazardCategories.slice(0, 8).map(c => c.label),
  series: [{ name: 'Findings', data: hazardCategories.slice(0, 8).map((_, i) => 6 + i * 3) }]
}))

const overdueTrend = {
  categories: ['W-7','W-6','W-5','W-4','W-3','W-2','W-1','Now'],
  series: [{ name: 'Overdue', data: [22, 25, 21, 27, 24, 19, 18, 21] }, { name: 'Open', data: [55, 60, 58, 65, 62, 58, 55, 62] }]
}

const ccfTrend = {
  categories: ['Q1','Q2','Q3','Q4'],
  series: [{ name: 'Failures', data: [3, 5, 4, 2] }]
}

const heatmap = {
  x: ['Forklift','Vehicle','Press','Conveyor','Crane','Compressor'],
  y: sites.map(s => s.name.split(' ')[0]),
  data: []
}
for (let yi = 0; yi < heatmap.y.length; yi++) {
  for (let xi = 0; xi < heatmap.x.length; xi++) {
    heatmap.data.push([xi, yi, 50 + (yi * 7 + xi * 11) % 50])
  }
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <h1 class="text-2xl font-semibold text-slate-800">Analytics</h1>
      <p class="text-sm text-slate-500">Cross-site performance and risk trends</p>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card title="Inspection volume"><LineChart :categories="volume.categories" :series="volume.series" /></Card>
      <Card title="Average score by site"><BarChart :categories="scoreBySite.categories" :series="scoreBySite.series" /></Card>
      <Card title="Findings by category"><BarChart :categories="findingsByCategory.categories" :series="findingsByCategory.series" horizontal /></Card>
      <Card title="Action backlog trend"><LineChart :categories="overdueTrend.categories" :series="overdueTrend.series" /></Card>
      <Card title="Critical control failures"><BarChart :categories="ccfTrend.categories" :series="ccfTrend.series" /></Card>
      <Card title="Score distribution by site &amp; asset class"><HeatmapChart :x-categories="heatmap.x" :y-categories="heatmap.y" :data="heatmap.data" /></Card>
    </div>
  </div>
</template>
