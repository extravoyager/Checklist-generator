import { defaultScoringConfig } from '../data/scoringDefaults'
import { getBand } from '../utils/scoreBand'

// Determine if a single response is a "fail" / flagged
export function isFailResponse(question, response) {
  if (response === null || response === undefined || response === '') return null
  const flagged = {
    yes_no_na: ['No'], pass_fail_na: ['Fail'], safe_at_risk_na: ['At Risk']
  }[question.responseType]
  if (!flagged) return false
  return flagged.includes(response)
}

export function isNAResponse(question, response) {
  return response === 'N/A'
}

export function calculateScore(template, responses, settings = defaultScoringConfig) {
  const sectionScores = []
  let totalPoints = 0, maxPoints = 0
  let criticalFailures = 0, flaggedCount = 0, naCount = 0, answered = 0

  for (const section of template.sections) {
    let sPoints = 0, sMax = 0, sAnswered = 0
    for (const q of section.questions) {
      const resp = responses[q.id]
      if (resp === undefined || resp === null || resp === '') continue
      sAnswered++; answered++
      const na = isNAResponse(q, resp)
      const fail = isFailResponse(q, resp)
      if (na) {
        naCount++
        if (settings.naTreatment === 'neutral') {
          // count as full points
          const w = settings.method === 'weighted_question' ? (q.weight || 1) : 1
          sPoints += w; sMax += w
        }
        continue
      }
      if (fail === null) continue // non-scored type (text etc)
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
    // start at 100, deduct 5 per flagged, 15 per critical fail
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

  const band = getBand(totalScore, settings.bands)

  return {
    totalScore,
    scoreBand: band,
    sectionScores,
    criticalFailures,
    criticalFailureFlag,
    flaggedCount,
    naCount,
    answered
  }
}
