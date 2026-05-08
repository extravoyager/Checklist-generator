import { defaultScoringConfig } from '../data/scoringDefaults'

export function getBand(score, bands = defaultScoringConfig.bands) {
  if (score === null || score === undefined || isNaN(score)) return bands[bands.length - 1]
  return bands.find(b => score >= b.min && score <= b.max) || bands[bands.length - 1]
}

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
