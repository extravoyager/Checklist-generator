<script setup>
import BaseChart from './BaseChart.vue'
import { computed } from 'vue'
const props = defineProps({ categories: Array, series: Array, height: String, smooth: { type: Boolean, default: true } })
const option = computed(() => ({
  grid: { left: 40, right: 16, top: 24, bottom: 28 },
  tooltip: { trigger: 'axis' },
  legend: { show: props.series.length > 1, bottom: 0, textStyle: { fontSize: 11 } },
  xAxis: { type: 'category', data: props.categories, axisLine: { lineStyle: { color: '#cbd5e1' } }, axisLabel: { color: '#64748b', fontSize: 11 } },
  yAxis: { type: 'value', axisLine: { show: false }, axisLabel: { color: '#64748b', fontSize: 11 }, splitLine: { lineStyle: { color: '#f1f5f9' } } },
  series: props.series.map((s, i) => ({
    name: s.name, type: 'line', smooth: props.smooth, data: s.data,
    lineStyle: { width: 2, color: ['#3f6896','#0e7490','#7c3aed','#d97706'][i % 4] },
    itemStyle: { color: ['#3f6896','#0e7490','#7c3aed','#d97706'][i % 4] },
    areaStyle: { color: ['rgba(63,104,150,0.1)','rgba(14,116,144,0.1)','rgba(124,58,237,0.1)','rgba(217,119,6,0.1)'][i % 4] }
  }))
}))
</script>
<template><BaseChart :option="option" :height="height || '260px'" /></template>
