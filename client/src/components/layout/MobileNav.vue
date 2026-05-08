<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { LayoutDashboard, ClipboardList, ListTodo, AlertTriangle, FileStack } from 'lucide-vue-next'
const route = useRoute()
const items = [
  { to: '/', label: 'Home', icon: LayoutDashboard },
  { to: '/templates', label: 'Templates', icon: FileStack },
  { to: '/inspections', label: 'Inspect', icon: ClipboardList },
  { to: '/actions', label: 'Actions', icon: ListTodo },
  { to: '/findings', label: 'Findings', icon: AlertTriangle }
]
const isActive = (to) => route.path === to || (to !== '/' && route.path.startsWith(to))
</script>

<template>
  <nav class="mobile-nav md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-30 flex">
    <RouterLink v-for="i in items" :key="i.to" :to="i.to"
      :class="['flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[11px]',
        isActive(i.to) ? 'text-primary-700' : 'text-slate-500']">
      <component :is="i.icon" class="w-5 h-5" />
      <span>{{ i.label }}</span>
    </RouterLink>
  </nav>
</template>
