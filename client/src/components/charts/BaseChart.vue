<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts/core'
import { LineChart, BarChart, PieChart, HeatmapChart } from 'echarts/charts'
import {
  GridComponent, TooltipComponent, LegendComponent, TitleComponent,
  DataZoomComponent, VisualMapComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([LineChart, BarChart, PieChart, HeatmapChart,
  GridComponent, TooltipComponent, LegendComponent, TitleComponent, DataZoomComponent, VisualMapComponent,
  CanvasRenderer])

const props = defineProps({ option: Object, height: { type: String, default: '280px' } })

const el = ref(null)
let inst = null

function resize() { inst && inst.resize() }

onMounted(() => {
  inst = echarts.init(el.value)
  inst.setOption(props.option || {})
  window.addEventListener('resize', resize)
})

watch(() => props.option, (val) => {
  if (inst && val) inst.setOption(val, true)
}, { deep: true })

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  inst && inst.dispose()
})
</script>

<template>
  <div ref="el" :style="{ height, width: '100%' }" />
</template>
