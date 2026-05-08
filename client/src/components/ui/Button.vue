<script setup>
defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  disabled: Boolean,
  type: { type: String, default: 'button' }
})
const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700',
  secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50',
  ghost: 'text-slate-600 hover:bg-slate-100',
  danger: 'bg-danger-600 text-white hover:bg-danger-700',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700'
}
const sizes = { sm: 'px-2.5 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-5 py-3 text-base' }
</script>

<template>
  <button :type="type" :disabled="disabled"
    :class="['inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed', variants[variant], sizes[size]]">
    <slot />
  </button>
</template>
