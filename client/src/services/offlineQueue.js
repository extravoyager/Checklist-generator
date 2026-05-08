// Mock offline queue - stores pending changes in localStorage.
// In a real app this would sync via service worker / IndexedDB.

const KEY = 'checkwise.offlineQueue'

export function loadQueue() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

export function pushQueue(item) {
  const q = loadQueue()
  q.push({ id: Math.random().toString(36).slice(2), at: Date.now(), ...item })
  localStorage.setItem(KEY, JSON.stringify(q))
  return q.length
}

export function clearQueue() {
  localStorage.setItem(KEY, '[]')
}

export function queueLength() {
  return loadQueue().length
}
