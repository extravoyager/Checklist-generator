// getBand lives in the shared scoring engine; this module only carries UI-only helpers.
export { getBand } from '../../../shared/scoringService.js'

export function bandColorClasses(color) {
  const map = {
    emerald: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    amber: 'bg-amber-100 text-amber-800 border-amber-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-200',
    red: 'bg-red-100 text-red-800 border-red-200'
  }
  return map[color] || 'bg-slate-100 text-slate-700 border-slate-200'
}
