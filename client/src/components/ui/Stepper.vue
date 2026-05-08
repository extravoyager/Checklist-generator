<script setup>
defineProps({ steps: Array, current: Number })
</script>

<template>
  <ol class="flex items-center gap-2 w-full">
    <li v-for="(s, i) in steps" :key="i" class="flex-1 flex items-center gap-2">
      <div :class="['w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-none',
        i < current ? 'bg-emerald-600 text-white' : i === current ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-600']">
        {{ i + 1 }}
      </div>
      <span class="text-xs font-medium text-slate-600 hidden sm:inline">{{ s }}</span>
      <div v-if="i < steps.length - 1" class="flex-1 h-px bg-slate-200" />
    </li>
  </ol>
</template>
