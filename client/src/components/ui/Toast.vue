<script setup>
import { useToastStore } from '../../stores/toast'
import { CheckCircle2, XCircle, Info, X } from 'lucide-vue-next'
const toast = useToastStore()
const icons = { success: CheckCircle2, error: XCircle, info: Info }
const styles = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800'
}
</script>

<template>
  <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
    <transition-group name="toast" tag="div" class="flex flex-col gap-2">
      <div v-for="t in toast.items" :key="t.id"
        :class="['flex items-start gap-2 px-4 py-3 rounded-lg border shadow-soft', styles[t.type] || styles.info]">
        <component :is="icons[t.type] || Info" class="w-5 h-5 flex-none mt-0.5" />
        <div class="text-sm flex-1">{{ t.message }}</div>
        <button @click="toast.dismiss(t.id)" class="text-slate-400 hover:text-slate-600"><X class="w-4 h-4" /></button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.2s; }
.toast-enter-from { opacity: 0; transform: translateY(-8px); }
.toast-leave-to { opacity: 0; transform: translateX(20px); }
</style>
