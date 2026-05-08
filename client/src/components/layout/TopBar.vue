<script setup>
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'
import { Menu, LogOut, RefreshCw } from 'lucide-vue-next'
import { defaultRoles } from '../../data/defaultRoles'
import { computed } from 'vue'
const auth = useAuthStore()
const router = useRouter()
const emit = defineEmits(['toggle-mobile'])
const role = computed(() => defaultRoles.find(r => r.id === auth.user?.roleId))
function switchUser() { auth.logout(); router.push('/login') }
</script>

<template>
  <header class="topbar bg-white border-b border-slate-200 h-14 flex items-center px-4 sticky top-0 z-30">
    <button class="md:hidden p-2 -ml-2 text-slate-600" @click="emit('toggle-mobile')"><Menu class="w-5 h-5" /></button>
    <div class="flex-1" />
    <div class="flex items-center gap-3">
      <div class="hidden sm:flex flex-col items-end">
        <span class="text-sm font-medium text-slate-800">{{ auth.user?.name }}</span>
        <span class="text-[11px] text-slate-500 -mt-0.5">{{ role?.name }}</span>
      </div>
      <div class="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold"
        :style="{ backgroundColor: auth.user?.color }">{{ auth.user?.initials }}</div>
      <button @click="switchUser" class="text-slate-500 hover:text-slate-700 p-2 rounded-lg" title="Switch user">
        <RefreshCw class="w-4 h-4" />
      </button>
    </div>
  </header>
</template>
