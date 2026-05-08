<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { users } from '../data/seedData'
import { defaultRoles } from '../data/defaultRoles'
import { ShieldHalf, ArrowRight } from 'lucide-vue-next'

const router = useRouter()
const auth = useAuthStore()
const selected = ref(users[0].id)

function go() {
  auth.login(selected.value)
  router.push('/')
}

function quickPick(id) {
  selected.value = id
  go()
}

function role(roleId) { return defaultRoles.find(r => r.id === roleId)?.name }
</script>

<template>
  <div class="min-h-screen flex flex-col md:flex-row">
    <div class="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary-700 via-primary-800 to-slate-900 text-white p-12 flex-col justify-between">
      <div class="flex items-center gap-3">
        <ShieldHalf class="w-9 h-9 text-primary-200" />
        <div>
          <div class="text-2xl font-bold">CheckWise EHS</div>
          <div class="text-sm text-primary-200">Inspection &amp; checklist platform</div>
        </div>
      </div>
      <div class="space-y-4">
        <h1 class="text-4xl font-bold leading-tight">Run safer sites with smarter checklists.</h1>
        <p class="text-primary-200 text-base max-w-md">Generate, customise, and execute EHS inspections with built-in scoring,
          critical-control verification, and actionable insights.</p>
        <div class="grid grid-cols-3 gap-4 text-sm">
          <div><div class="text-2xl font-semibold">30+</div><div class="text-primary-200 text-xs">Pre-built templates</div></div>
          <div><div class="text-2xl font-semibold">12</div><div class="text-primary-200 text-xs">Default roles</div></div>
          <div><div class="text-2xl font-semibold">15</div><div class="text-primary-200 text-xs">Modules</div></div>
        </div>
      </div>
      <div class="text-xs text-primary-300">Demo build - no production data.</div>
    </div>

    <div class="flex-1 flex items-center justify-center p-6 bg-slate-50">
      <div class="w-full max-w-md bg-white rounded-2xl shadow-soft border border-slate-100 p-8">
        <div class="md:hidden flex items-center gap-2 mb-6">
          <ShieldHalf class="w-7 h-7 text-primary-700" />
          <div class="font-semibold text-slate-800">CheckWise EHS</div>
        </div>
        <h2 class="text-xl font-semibold text-slate-800">Sign in to continue</h2>
        <p class="text-sm text-slate-500 mt-1">Pick a demo user. No password required.</p>

        <label class="label mt-5">Sign in as</label>
        <select v-model="selected" class="input">
          <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }} - {{ role(u.roleId) }}</option>
        </select>

        <button @click="go" class="mt-4 w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2">
          Continue <ArrowRight class="w-4 h-4" />
        </button>

        <div class="mt-6">
          <div class="text-xs uppercase tracking-wide text-slate-500 mb-2">Quick switch</div>
          <div class="flex flex-wrap gap-2">
            <button v-for="u in users.slice(0, 6)" :key="u.id" @click="quickPick(u.id)"
              class="text-xs px-2.5 py-1 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700">
              {{ u.name.split(' ')[0] }} - {{ role(u.roleId).split(' ')[0] }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
