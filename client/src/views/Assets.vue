<script setup>
import { useAssetStore } from '../stores/assets'
import Card from '../components/ui/Card.vue'
import Badge from '../components/ui/Badge.vue'
import { formatDate } from '../utils/formatDate'
import { useRouter } from 'vue-router'

const store = useAssetStore()
const router = useRouter()
</script>

<template>
  <div class="space-y-4">
    <div>
      <h1 class="text-2xl font-semibold text-slate-800">Assets</h1>
      <p class="text-sm text-slate-500">{{ store.list.length }} registered assets across {{ store.sites.length }} sites</p>
    </div>
    <Card :padded="false">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th class="text-left px-4 py-2.5">Asset</th>
              <th class="text-left px-4 py-2.5">Type</th>
              <th class="text-left px-4 py-2.5">Site</th>
              <th class="text-left px-4 py-2.5">Last inspection</th>
              <th class="text-left px-4 py-2.5">Next service</th>
              <th class="text-left px-4 py-2.5">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="a in store.list" :key="a.id" class="hover:bg-slate-50/50 cursor-pointer" @click="router.push('/assets/' + a.id)">
              <td class="px-4 py-3 font-medium text-slate-800">{{ a.name }}<div class="text-xs text-slate-500">{{ a.serial }}</div></td>
              <td class="px-4 py-3 text-slate-600">{{ a.type }}</td>
              <td class="px-4 py-3 text-slate-600">{{ store.siteName(a.siteId) }}</td>
              <td class="px-4 py-3 text-slate-600">{{ formatDate(a.lastInspectionDate) }}</td>
              <td class="px-4 py-3 text-slate-600">{{ formatDate(a.nextServiceDate) }}</td>
              <td class="px-4 py-3"><Badge :color="a.status === 'in_service' ? 'emerald' : 'red'">{{ a.status.replace('_',' ') }}</Badge></td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  </div>
</template>
