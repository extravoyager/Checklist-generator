<script setup>
import { X } from 'lucide-vue-next'
defineProps({ open: Boolean, title: String, side: { type: String, default: 'right' } })
const emit = defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="open" class="fixed inset-0 z-40 bg-slate-900/40" @click="emit('close')" />
    </transition>
    <transition name="slide">
      <aside v-if="open" :class="['fixed top-0 bottom-0 z-50 bg-white w-full sm:w-[28rem] flex flex-col shadow-xl', side === 'right' ? 'right-0' : 'left-0']">
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 class="font-semibold text-slate-800">{{ title }}</h3>
          <button class="text-slate-400 hover:text-slate-600" @click="emit('close')"><X class="w-5 h-5" /></button>
        </div>
        <div class="flex-1 overflow-y-auto thin-scroll p-5">
          <slot />
        </div>
        <div v-if="$slots.footer" class="px-5 py-3 border-t border-slate-100 flex justify-end gap-2">
          <slot name="footer" />
        </div>
      </aside>
    </transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: transform 0.2s; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
