export function formatDate(d, opts = {}) {
  if (!d) return ''
  const date = d instanceof Date ? d : new Date(d)
  if (isNaN(date.getTime())) return ''
  const { time = false } = opts
  const dateStr = date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  if (!time) return dateStr
  return dateStr + ' ' + date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

export function relativeTime(d) {
  if (!d) return ''
  const date = d instanceof Date ? d : new Date(d)
  const diff = (Date.now() - date.getTime()) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago'
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago'
  if (diff < 604800) return Math.floor(diff / 86400) + 'd ago'
  return formatDate(d)
}

export function daysFromNow(d) {
  if (!d) return null
  const date = d instanceof Date ? d : new Date(d)
  return Math.round((date.getTime() - Date.now()) / 86400000)
}
