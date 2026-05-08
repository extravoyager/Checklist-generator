<script setup>
import { ref } from 'vue'
import Sidebar from './Sidebar.vue'
import TopBar from './TopBar.vue'
import MobileNav from './MobileNav.vue'
import Drawer from '../ui/Drawer.vue'

const mobileOpen = ref(false)
</script>

<template>
  <div class="flex min-h-screen bg-slate-50">
    <Sidebar />
    <div class="flex-1 flex flex-col min-w-0">
      <TopBar @toggle-mobile="mobileOpen = true" />
      <main class="flex-1 overflow-x-hidden p-4 md:p-6 pb-20 md:pb-6">
        <slot />
      </main>
    </div>
    <MobileNav />
    <Drawer :open="mobileOpen" title="Menu" side="right" @close="mobileOpen = false">
      <Sidebar />
    </Drawer>
  </div>
</template>
