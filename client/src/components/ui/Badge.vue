<script setup>
defineProps({
  color: { type: String, default: 'slate' },
  text: String
})
const palette = {
  slate: 'bg-slate-100 text-slate-700',
  emerald: 'bg-emerald-100 text-emerald-800',
  blue: 'bg-blue-100 text-blue-800',
  amber: 'bg-amber-100 text-amber-800',
  red: 'bg-red-100 text-red-800',
  orange: 'bg-orange-100 text-orange-800',
  purple: 'bg-purple-100 text-purple-800',
  primary: 'bg-primary-100 text-primary-700'
}
</script>

<template>
  <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', palette[color] || palette.slate]">
    <slot>{{ text }}</slot>
  </span>
</template>
