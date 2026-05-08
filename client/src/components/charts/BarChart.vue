<script setup>
import BaseChart from './BaseChart.vue'
import { computed } from 'vue'
const props = defineProps({ categories: Array, series: Array, height: String, horizontal: Boolean })
const palette = ['#3f6896','#0e7490','#7c3aed','#d97706','#dc2626','#059669']
const option = computed(() => ({
  grid: { left: props.horizontal ? 100 : 40, right: 16, top: 20, bottom: 28 },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { show: props.series.length > 1, bottom: 0, textStyle: { fontSize: 11 } },
  xAxis: props.horizontal
    ? { type: 'value', axisLabel: { color: '#64748b', fontSize: 11 }, splitLine: { lineStyle: { color: '#f1f5f9' } } }
    : { type: 'category', data: props.categories, axisLabel: { color: '#64748b', fontSize: 11, rotate: props.categories.length > 6 ? 25 : 0 }, axisLine: { lineStyle: { color: '#cbd5e1' } } },
  yAxis: props.horizontal
    ? { type: 'category', data: props.categories, axisLabel: { color: '#64748b', fontSize: 11 } }
    : { type: 'value', axisLabel: { color: '#64748b', fontSize: 11 }, splitLine: { lineStyle: { color: '#f1f5f9' } } },
  series: props.series.map((s, i) => ({
    name: s.name, type: 'bar', data: s.data, barMaxWidth: 28,
    itemStyle: { borderRadius: props.horizontal ? [0, 6, 6, 0] : [6, 6, 0, 0], color: palette[i % palette.length] }
  }))
}))
</script>
<template><BaseChart :option="option" :height="height || '260px'" /></template>
