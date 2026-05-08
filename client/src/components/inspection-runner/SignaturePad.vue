<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Pen, RotateCcw, Check } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: Object, default: null },
  signerName: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

const canvas = ref(null)
const wrapper = ref(null)
let ctx = null
let drawing = false
let last = null
let hasInk = false

function resize() {
  if (!canvas.value || !wrapper.value) return
  const rect = wrapper.value.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  // preserve current ink across resize by sampling/restoring
  const prev = canvas.value.toDataURL()
  canvas.value.width = Math.round(rect.width * dpr)
  canvas.value.height = Math.round(180 * dpr)
  canvas.value.style.width = rect.width + 'px'
  canvas.value.style.height = '180px'
  ctx = canvas.value.getContext('2d')
  ctx.scale(dpr, dpr)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.lineWidth = 2
  ctx.strokeStyle = '#0f172a'
  if (hasInk) {
    const img = new Image()
    img.onload = () => ctx.drawImage(img, 0, 0, rect.width, 180)
    img.src = prev
  }
}

function pointerPos(e) {
  const rect = canvas.value.getBoundingClientRect()
  const x = (e.clientX ?? (e.touches && e.touches[0]?.clientX)) - rect.left
  const y = (e.clientY ?? (e.touches && e.touches[0]?.clientY)) - rect.top
  return { x, y }
}

function start(e) {
  e.preventDefault()
  drawing = true
  last = pointerPos(e)
  hasInk = true
}
function move(e) {
  if (!drawing) return
  e.preventDefault()
  const p = pointerPos(e)
  ctx.beginPath()
  ctx.moveTo(last.x, last.y)
  ctx.lineTo(p.x, p.y)
  ctx.stroke()
  last = p
}
function end() {
  if (!drawing) return
  drawing = false
}

function clear() {
  ctx && ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
  hasInk = false
  emit('update:modelValue', null)
}

function save() {
  if (!hasInk) return
  emit('update:modelValue', {
    dataUrl: canvas.value.toDataURL('image/png'),
    signerName: props.signerName,
    signedAt: new Date().toISOString()
  })
}

onMounted(() => {
  resize()
  window.addEventListener('resize', resize)
  // If a signature was previously saved, paint it back
  if (props.modelValue && props.modelValue.dataUrl) {
    const img = new Image()
    img.onload = () => {
      const rect = wrapper.value.getBoundingClientRect()
      ctx.drawImage(img, 0, 0, rect.width, 180)
      hasInk = true
    }
    img.src = props.modelValue.dataUrl
  }
})

onBeforeUnmount(() => window.removeEventListener('resize', resize))

watch(() => props.modelValue, (v) => {
  if (!v) {
    ctx && ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
    hasInk = false
  }
})
</script>

<template>
  <div>
    <div ref="wrapper" class="relative border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 overflow-hidden">
      <canvas ref="canvas"
        class="block touch-none cursor-crosshair"
        @pointerdown="start" @pointermove="move" @pointerup="end" @pointerleave="end" @pointercancel="end" />
      <div v-if="!modelValue" class="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-sm">
        <Pen class="w-4 h-4 mr-2" /> Sign here
      </div>
      <div v-if="modelValue" class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium flex items-center gap-1">
        <Check class="w-3 h-3" /> Signed
      </div>
    </div>
    <div class="mt-2 flex items-center justify-between text-xs">
      <div class="text-slate-500">
        <span v-if="modelValue">Signed by <span class="font-medium text-slate-700">{{ modelValue.signerName || 'Inspector' }}</span> on {{ new Date(modelValue.signedAt).toLocaleString() }}</span>
        <span v-else>Draw your signature with mouse, finger, or stylus</span>
      </div>
      <div class="flex items-center gap-2">
        <button type="button" @click="clear" class="text-slate-500 hover:text-slate-700 inline-flex items-center gap-1"><RotateCcw class="w-3.5 h-3.5" /> Clear</button>
        <button type="button" @click="save" class="px-3 py-1 rounded-md bg-primary-600 text-white text-xs font-medium hover:bg-primary-700">Save signature</button>
      </div>
    </div>
  </div>
</template>
