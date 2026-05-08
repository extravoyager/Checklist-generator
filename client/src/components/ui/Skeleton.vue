<script setup>
defineProps({ height: { type: String, default: 'h-4' }, width: { type: String, default: 'w-full' } })
</script>
<template>
  <div :class="['animate-pulse bg-slate-200 rounded', height, width]" />
</template>
