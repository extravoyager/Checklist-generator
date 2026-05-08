// Tiny API client. All calls go through fetch to /api with x-user-id header.
// Has graceful fallback to seed data when the server is unreachable.

function userId() {
  try { return JSON.parse(localStorage.getItem('checkwise.user') || 'null')?.id || '' } catch { return '' }
}

async function call(method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json', 'x-user-id': userId() } }
  if (body !== undefined) opts.body = JSON.stringify(body)
  const res = await fetch('/api' + path, opts)
  if (!res.ok) throw new Error('API ' + res.status + ' ' + path)
  return res.json()
}

export const api = {
  get: (p) => call('GET', p),
  post: (p, b) => call('POST', p, b),
  put: (p, b) => call('PUT', p, b),
  del: (p) => call('DELETE', p)
}

export async function safe(fn, fallback) {
  try { return await fn() } catch (e) {
    console.warn('[api fallback]', e.message)
    return fallback
  }
}
