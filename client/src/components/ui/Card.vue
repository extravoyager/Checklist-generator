<script setup>
defineProps({ padded: { type: Boolean, default: true }, title: String })
</script>

<template>
  <div :class="['bg-white rounded-xl shadow-soft border border-slate-100', padded ? 'p-6' : '']">
    <div v-if="title || $slots.header" class="flex items-center justify-between mb-4">
      <h3 v-if="title" class="text-base font-semibold text-slate-800">{{ title }}</h3>
      <slot name="header" />
    </div>
    <slot />
  </div>
</template>
