<script setup>
import { useAuthStore } from '../../stores/auth'
import { RouterLink, useRoute } from 'vue-router'
import {
  LayoutDashboard, Sparkles, FileStack, Library, ClipboardList,
  ListTodo, AlertTriangle, Boxes, BarChart3, Settings, ShieldCheck, Calculator, ShieldHalf
} from 'lucide-vue-next'
import { computed } from 'vue'
const auth = useAuthStore()
const route = useRoute()

const items = computed(() => [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, perm: null },
  { to: '/generator', label: 'Checklist Generator', icon: Sparkles, perm: 'template.create' },
  { to: '/templates', label: 'Template Library', icon: FileStack, perm: 'template.view' },
  { to: '/prebuilt', label: 'Pre-built Library', icon: Library, perm: 'template.view' },
  { to: '/inspections', label: 'Inspections', icon: ClipboardList, perm: 'inspection.view' },
  { to: '/actions', label: 'Actions', icon: ListTodo, perm: 'action.view' },
  { to: '/findings', label: 'Findings', icon: AlertTriangle, perm: 'finding.view' },
  { to: '/assets', label: 'Assets', icon: Boxes, perm: 'asset.view' },
  { to: '/analytics', label: 'Analytics', icon: BarChart3, perm: 'analytics.view' }
])

const adminItems = computed(() => [
  { to: '/admin', label: 'Admin Settings', icon: Settings, perm: 'admin.view' },
  { to: '/admin/roles', label: 'Roles & Permissions', icon: ShieldCheck, perm: 'admin.manage_roles' },
  { to: '/admin/scoring', label: 'Scoring Settings', icon: Calculator, perm: 'admin.scoring' }
])

function visible(item) {
  return item.perm == null || auth.can(item.perm)
}

const isActive = (to) => route.path === to || (to !== '/' && route.path.startsWith(to))
</script>

<template>
  <aside class="sidebar hidden md:flex flex-col w-64 bg-slate-900 text-slate-100 flex-none">
    <div class="px-5 py-5 flex items-center gap-2 border-b border-slate-800">
      <ShieldHalf class="w-7 h-7 text-primary-300" />
      <div>
        <div class="font-semibold text-white text-base leading-tight">CheckWise</div>
        <div class="text-[11px] text-slate-400 -mt-0.5">EHS Inspection Platform</div>
      </div>
    </div>
    <nav class="flex-1 overflow-y-auto thin-scroll px-3 py-4 space-y-0.5">
      <div class="text-[10px] uppercase tracking-wider text-slate-500 px-2 mb-2">Workspace</div>
      <template v-for="i in items" :key="i.to">
        <RouterLink v-if="visible(i)" :to="i.to"
          :class="['flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
            isActive(i.to) ? 'bg-primary-700/40 text-white border-l-2 border-primary-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white']">
          <component :is="i.icon" class="w-4 h-4" />
          <span>{{ i.label }}</span>
        </RouterLink>
      </template>

      <div v-if="adminItems.some(visible)" class="text-[10px] uppercase tracking-wider text-slate-500 px-2 mt-5 mb-2">Administration</div>
      <template v-for="i in adminItems" :key="i.to">
        <RouterLink v-if="visible(i)" :to="i.to"
          :class="['flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
            isActive(i.to) ? 'bg-primary-700/40 text-white border-l-2 border-primary-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white']">
          <component :is="i.icon" class="w-4 h-4" />
          <span>{{ i.label }}</span>
        </RouterLink>
      </template>
    </nav>
    <div class="px-4 py-3 border-t border-slate-800 text-[11px] text-slate-500">
      v0.1.0 - Demo build
    </div>
  </aside>
</template>
