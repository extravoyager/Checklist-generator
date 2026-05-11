// Pure scoring engine - no UI or DB deps. Used by the client (live preview,
// inspection runner, report) and the server (/api/scoring/calculate).
import { defaultScoringConfig } from './scoringDefaults.js'

const FLAGGED_BY_TYPE = {
  yes_no_na: ['No'],
  pass_fail_na: ['Fail'],
  safe_at_risk_na: ['At Risk']
}

export function isFailResponse(question, response) {
  if (response === null || response === undefined || response === '') return null
  const flagged = FLAGGED_BY_TYPE[question.responseType]
  if (!flagged) return false
  return flagged.includes(response)
}

export function isNAResponse(question, response) {
  return response === 'N/A'
}

export function getBand(score, bands = defaultScoringConfig.bands) {
  if (score === null || score === undefined || isNaN(score)) return bands[bands.length - 1]
  return bands.find(b => score >= b.min && score <= b.max) || bands[bands.length - 1]
}

export function calculateScore(template, responses, settings = defaultScoringConfig) {
  const sectionScores = []
  let totalPoints = 0, maxPoints = 0
  let criticalFailures = 0, flaggedCount = 0, naCount = 0, answered = 0

  for (const section of template.sections) {
    let sPoints = 0, sMax = 0
    for (const q of section.questions) {
      const resp = responses[q.id]
      if (resp === undefined || resp === null || resp === '') continue
      answered++
      const na = isNAResponse(q, resp)
      const fail = isFailResponse(q, resp)
      if (na) {
        naCount++
        if (settings.naTreatment === 'neutral') {
          const w = settings.method === 'weighted_question' ? (q.weight || 1) : 1
          sPoints += w; sMax += w
        }
        continue
      }
      if (fail === null) continue // non-scored response type (text, photo, signature, etc.)
      const w = settings.method === 'weighted_question' ? (q.weight || 1) : 1
      sMax += w
      if (!fail) sPoints += w
      else {
        flaggedCount++
        if (q.criticality === 'critical') criticalFailures++
      }
    }
    const sectionPct = sMax === 0 ? null : Math.round((sPoints / sMax) * 100)
    sectionScores.push({ id: section.id, title: section.title, score: sectionPct, weight: section.weight || 1 })
    if (settings.method === 'weighted_section' && sMax > 0) {
      totalPoints += sectionPct * (section.weight || 1)
      maxPoints += 100 * (section.weight || 1)
    } else {
      totalPoints += sPoints
      maxPoints += sMax
    }
  }

  let totalScore = maxPoints === 0 ? 0 : Math.round((totalPoints / maxPoints) * 100)
  if (settings.method === 'deduction') {
    totalScore = Math.max(0, 100 - (flaggedCount * 5) - (criticalFailures * 15))
  }

  let criticalFailureFlag = false
  if (criticalFailures > 0) {
    if (settings.criticalFailureMode === 'cap') {
      totalScore = Math.min(totalScore, settings.criticalFailureCap)
    } else {
      criticalFailureFlag = true
    }
  }

  return {
    totalScore,
    scoreBand: getBand(totalScore, settings.bands),
    sectionScores,
    criticalFailures,
    criticalFailureFlag,
    flaggedCount,
    naCount,
    answered
  }
}
