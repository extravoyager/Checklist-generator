<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import AppShell from './components/layout/AppShell.vue'
import Toast from './components/ui/Toast.vue'

const route = useRoute()
const auth = useAuthStore()

const showShell = computed(() => auth.user && route.name !== 'login')
</script>

<template>
  <div class="min-h-screen">
    <AppShell v-if="showShell">
      <router-view />
    </AppShell>
    <router-view v-else />
    <Toast />
  </div>
</template>
