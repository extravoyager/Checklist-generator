<script setup>
defineProps({ tabs: Array, modelValue: String })
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="border-b border-slate-200">
    <nav class="-mb-px flex gap-2 overflow-x-auto thin-scroll">
      <button v-for="t in tabs" :key="t.id" @click="emit('update:modelValue', t.id)"
        :class="['whitespace-nowrap px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
          modelValue === t.id ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700']">
        {{ t.label }}
      </button>
    </nav>
  </div>
</template>
