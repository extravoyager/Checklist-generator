// Mirror of the client scoring service so the API gives identical results.
const defaults = {
  method: 'simple_percentage', passThreshold: 75, naTreatment: 'exclude',
  criticalFailureCap: 50, criticalFailureMode: 'cap',
  bands: [
    { id: 'excellent', label: 'Excellent', min: 90, max: 100, color: 'emerald' },
    { id: 'good', label: 'Good', min: 75, max: 89, color: 'blue' },
    { id: 'needs', label: 'Needs Improvement', min: 60, max: 74, color: 'amber' },
    { id: 'poor', label: 'Poor', min: 40, max: 59, color: 'orange' },
    { id: 'critical', label: 'Critical Concern', min: 0, max: 39, color: 'red' }
  ]
}

function isFail(q, r) {
  const map = { yes_no_na: ['No'], pass_fail_na: ['Fail'], safe_at_risk_na: ['At Risk'] }
  const list = map[q.responseType]; if (!list) return false
  return list.includes(r)
}

function getBand(score, bands) {
  return bands.find(b => score >= b.min && score <= b.max) || bands[bands.length - 1]
}

export function calculateScore(template, responses, settings = defaults) {
  let totalPoints = 0, maxPoints = 0, criticalFailures = 0, flagged = 0, naCount = 0
  const sectionScores = []
  for (const s of template.sections) {
    let sp = 0, sm = 0
    for (const q of s.questions) {
      const r = responses[q.id]
      if (r === undefined || r === null || r === '') continue
      if (r === 'N/A') {
        naCount++
        if (settings.naTreatment === 'neutral') {
          const w = settings.method === 'weighted_question' ? (q.weight || 1) : 1
          sp += w; sm += w
        }
        continue
      }
      const w = settings.method === 'weighted_question' ? (q.weight || 1) : 1
      const fail = isFail(q, r)
      if (q.responseType && !['yes_no_na','pass_fail_na','safe_at_risk_na'].includes(q.responseType)) continue
      sm += w
      if (!fail) sp += w
      else { flagged++; if (q.criticality === 'critical') criticalFailures++ }
    }
    const pct = sm === 0 ? null : Math.round(sp / sm * 100)
    sectionScores.push({ id: s.id, title: s.title, score: pct, weight: s.weight || 1 })
    if (settings.method === 'weighted_section' && sm > 0) { totalPoints += pct * (s.weight || 1); maxPoints += 100 * (s.weight || 1) }
    else { totalPoints += sp; maxPoints += sm }
  }
  let score = maxPoints === 0 ? 0 : Math.round(totalPoints / maxPoints * 100)
  if (settings.method === 'deduction') score = Math.max(0, 100 - flagged * 5 - criticalFailures * 15)
  let critFlag = false
  if (criticalFailures > 0) {
    if (settings.criticalFailureMode === 'cap') score = Math.min(score, settings.criticalFailureCap)
    else critFlag = true
  }
  return { totalScore: score, scoreBand: getBand(score, settings.bands), sectionScores, criticalFailures, criticalFailureFlag: critFlag, flaggedCount: flagged, naCount }
}
