<script setup>
import { Inbox } from 'lucide-vue-next'
defineProps({ title: String, description: String, icon: { type: Object, default: () => Inbox } })
</script>

<template>
  <div class="text-center py-16 px-4">
    <div class="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
      <component :is="icon" class="w-6 h-6" />
    </div>
    <h3 class="mt-3 text-sm font-semibold text-slate-700">{{ title }}</h3>
    <p v-if="description" class="mt-1 text-sm text-slate-500 max-w-md mx-auto">{{ description }}</p>
    <div class="mt-4"><slot /></div>
  </div>
</template>
