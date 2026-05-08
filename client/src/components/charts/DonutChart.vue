<script setup>
import BaseChart from './BaseChart.vue'
import { computed } from 'vue'
const props = defineProps({ data: Array, height: String, colors: Array })
const palette = ['#3f6896','#0e7490','#7c3aed','#d97706','#dc2626','#059669','#475569']
const option = computed(() => ({
  tooltip: { trigger: 'item' },
  legend: { bottom: 0, textStyle: { fontSize: 11 } },
  series: [{
    type: 'pie', radius: ['55%', '78%'], center: ['50%', '46%'], avoidLabelOverlap: true,
    itemStyle: { borderColor: '#fff', borderWidth: 2 },
    label: { show: false },
    data: (props.data || []).map((d, i) => ({ ...d, itemStyle: { color: (props.colors && props.colors[i]) || palette[i % palette.length] } }))
  }]
}))
</script>
<template><BaseChart :option="option" :height="height || '260px'" /></template>
