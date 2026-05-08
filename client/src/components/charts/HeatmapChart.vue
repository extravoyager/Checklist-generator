<script setup>
import BaseChart from './BaseChart.vue'
import { computed } from 'vue'
const props = defineProps({ xCategories: Array, yCategories: Array, data: Array, height: String })
const option = computed(() => ({
  grid: { left: 100, right: 24, top: 40, bottom: 40 },
  tooltip: { position: 'top' },
  xAxis: { type: 'category', data: props.xCategories, axisLabel: { color: '#64748b', fontSize: 11 } },
  yAxis: { type: 'category', data: props.yCategories, axisLabel: { color: '#64748b', fontSize: 11 } },
  visualMap: { min: 0, max: 100, calculable: true, orient: 'horizontal', left: 'center', bottom: 0,
    inRange: { color: ['#fee2e2','#fef3c7','#d1fae5','#bae6fd','#3f6896'] }, textStyle: { fontSize: 11 } },
  series: [{ type: 'heatmap', data: props.data, label: { show: true, fontSize: 11 }, itemStyle: { borderColor: '#fff', borderWidth: 1 } }]
}))
</script>
<template><BaseChart :option="option" :height="height || '320px'" /></template>
