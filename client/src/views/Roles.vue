<script setup>
import { ref, computed } from 'vue'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import Badge from '../components/ui/Badge.vue'
import { useRoleStore } from '../stores/roles'
import { useToastStore } from '../stores/toast'
import { Plus, Copy, Trash2, Users } from 'lucide-vue-next'

const roles = useRoleStore()
const toast = useToastStore()

const groupedPerms = computed(() => {
  const groups = {}
  for (const p of roles.permissions) {
    const [g, ...rest] = p.split('.')
    if (!groups[g]) groups[g] = []
    groups[g].push(p)
  }
  return groups
})

function addRole() {
  const name = prompt('New role name?')
  if (name) { roles.addRole(name); toast.success('Role created') }
}

function userCount(roleId) {
  return roles.users.filter(u => u.roleId === roleId).length
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-start justify-between flex-wrap gap-3">
      <div>
        <h1 class="text-2xl font-semibold text-slate-800">Roles &amp; Permissions</h1>
        <p class="text-sm text-slate-500">{{ roles.roles.length }} roles - {{ roles.permissions.length }} permission keys</p>
      </div>
      <Button @click="addRole"><Plus class="w-4 h-4" /> New role</Button>
    </div>

    <Card :padded="false">
      <div class="overflow-x-auto">
        <table class="text-xs min-w-max">
          <thead>
            <tr class="bg-slate-50">
              <th class="text-left px-4 py-3 sticky left-0 bg-slate-50 min-w-[220px]">Permission</th>
              <th v-for="r in roles.roles" :key="r.id" class="px-2 py-3 text-center min-w-[110px]">
                <div class="font-semibold text-slate-700">{{ r.name }}</div>
                <div class="text-[11px] text-slate-500 flex items-center justify-center gap-1"><Users class="w-3 h-3" /> {{ userCount(r.id) }}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(perms, group) in groupedPerms" :key="group">
              <tr><td :colspan="roles.roles.length + 1" class="px-4 py-2 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 sticky left-0">{{ group }}</td></tr>
              <tr v-for="p in perms" :key="p" class="border-t border-slate-100">
                <td class="px-4 py-2 sticky left-0 bg-white text-slate-700">{{ p.replace(group + '.', '') }}</td>
                <td v-for="r in roles.roles" :key="r.id" class="text-center">
                  <input type="checkbox" :checked="r.permissions.includes(p)" @change="roles.togglePerm(r.id, p)" />
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </Card>

    <Card title="Role assignments">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div v-for="r in roles.roles" :key="r.id" class="p-3 rounded-lg border border-slate-100">
          <div class="flex items-start justify-between">
            <div>
              <div class="font-semibold text-slate-800 text-sm">{{ r.name }}</div>
              <div class="text-xs text-slate-500 mt-0.5">{{ r.description || '-' }}</div>
            </div>
            <Badge color="primary">{{ r.permissions.length }} perms</Badge>
          </div>
          <div class="mt-2 flex flex-wrap gap-1">
            <span v-for="u in roles.users.filter(u => u.roleId === r.id)" :key="u.id"
              class="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{{ u.name }}</span>
            <span v-if="!roles.users.filter(u => u.roleId === r.id).length" class="text-[11px] text-slate-400">No users assigned</span>
          </div>
          <div class="mt-3 flex gap-1.5">
            <button class="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1" @click="roles.duplicateRole(r.id)"><Copy class="w-3.5 h-3.5" /> Duplicate</button>
            <button v-if="!r.system" class="text-xs text-red-500 hover:text-red-700 flex items-center gap-1" @click="roles.removeRole(r.id)"><Trash2 class="w-3.5 h-3.5" /> Remove</button>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>
