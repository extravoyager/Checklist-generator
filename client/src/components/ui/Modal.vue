<script setup>
import { X } from 'lucide-vue-next'
defineProps({ open: Boolean, title: String, size: { type: String, default: 'md' } })
const emit = defineEmits(['close'])
const sizes = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-5xl' }
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" @click.self="emit('close')">
      <div :class="['bg-white rounded-xl shadow-xl w-full', sizes[size]]">
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 class="font-semibold text-slate-800">{{ title }}</h3>
          <button class="text-slate-400 hover:text-slate-600" @click="emit('close')"><X class="w-5 h-5" /></button>
        </div>
        <div class="p-5 max-h-[70vh] overflow-y-auto thin-scroll">
          <slot />
        </div>
        <div v-if="$slots.footer" class="px-5 py-3 border-t border-slate-100 flex justify-end gap-2">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
