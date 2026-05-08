<script setup>
import { ref, computed } from 'vue'
import { Camera, X, Image as ImageIcon, Trash2 } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  maxPhotos: { type: Number, default: 6 },
  maxWidth: { type: Number, default: 1280 },
  quality: { type: Number, default: 0.7 }
})
const emit = defineEmits(['update:modelValue'])

const fileInput = ref(null)
const lightbox = ref(null)
const busy = ref(false)

const photos = computed(() => Array.isArray(props.modelValue) ? props.modelValue : [])

function uid() { return 'p-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6) }

// Resize an image File via canvas before storing - keeps localStorage usable.
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, props.maxWidth / img.width)
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w; canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)
        resolve({
          id: uid(),
          name: file.name || 'photo.jpg',
          dataUrl: canvas.toDataURL('image/jpeg', props.quality),
          width: w,
          height: h,
          capturedAt: new Date().toISOString()
        })
      }
      img.onerror = reject
      img.src = reader.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function onFiles(e) {
  const files = Array.from(e.target.files || [])
  if (!files.length) return
  busy.value = true
  try {
    const slotsLeft = Math.max(0, props.maxPhotos - photos.value.length)
    const accepted = files.slice(0, slotsLeft)
    const compressed = await Promise.all(accepted.map(compressImage))
    emit('update:modelValue', [...photos.value, ...compressed])
  } finally {
    busy.value = false
    e.target.value = ''
  }
}

function removePhoto(id) {
  emit('update:modelValue', photos.value.filter(p => p.id !== id))
}

function openLightbox(p) { lightbox.value = p }
function closeLightbox() { lightbox.value = null }

function trigger() { fileInput.value && fileInput.value.click() }
</script>

<template>
  <div>
    <input ref="fileInput" type="file" accept="image/*" capture="environment" multiple class="hidden" @change="onFiles" />

    <div v-if="!photos.length" class="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
      <ImageIcon class="w-8 h-8 text-slate-300 mx-auto" />
      <p class="text-sm text-slate-500 mt-2">No photos captured yet.</p>
      <button type="button" @click="trigger" class="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700">
        <Camera class="w-4 h-4" /> Capture photo
      </button>
      <p class="text-[11px] text-slate-400 mt-2">Up to {{ maxPhotos }} photos. Resized to {{ maxWidth }}px wide.</p>
    </div>

    <div v-else class="space-y-3">
      <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
        <div v-for="p in photos" :key="p.id" class="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
          <img :src="p.dataUrl" :alt="p.name" class="w-full h-full object-cover cursor-zoom-in" @click="openLightbox(p)" />
          <button type="button" @click.stop="removePhoto(p.id)"
            class="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>
        <button v-if="photos.length < maxPhotos" type="button" @click="trigger"
          class="aspect-square rounded-lg border-2 border-dashed border-slate-200 text-slate-400 hover:border-primary-400 hover:text-primary-600 flex flex-col items-center justify-center gap-1 text-xs">
          <Camera class="w-5 h-5" />
          Add
        </button>
      </div>
      <div class="text-xs text-slate-500">{{ photos.length }} of {{ maxPhotos }} captured.</div>
    </div>

    <div v-if="busy" class="mt-2 text-xs text-slate-500">Processing photos...</div>

    <div v-if="lightbox" class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" @click="closeLightbox">
      <button type="button" class="absolute top-4 right-4 text-white" @click="closeLightbox"><X class="w-6 h-6" /></button>
      <img :src="lightbox.dataUrl" :alt="lightbox.name" class="max-w-full max-h-full object-contain" @click.stop />
    </div>
  </div>
</template>
