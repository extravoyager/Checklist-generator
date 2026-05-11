// Default scoring configuration. Shared between client (Pinia store seed) and
// server (seed.js, scoring API). UI-only band colours map to Tailwind classes
// in client/src/utils/scoreBand.js.
export const defaultScoringConfig = {
  method: 'simple_percentage', // simple_percentage | weighted_section | weighted_question | deduction
  passThreshold: 75,
  naTreatment: 'exclude', // exclude | neutral
  criticalFailureCap: 50, // cap total score when any critical question fails
  criticalFailureMode: 'cap', // cap | flag
  bands: [
    { id: 'excellent', label: 'Excellent', min: 90, max: 100, color: 'emerald' },
    { id: 'good', label: 'Good', min: 75, max: 89, color: 'blue' },
    { id: 'needs', label: 'Needs Improvement', min: 60, max: 74, color: 'amber' },
    { id: 'poor', label: 'Poor', min: 40, max: 59, color: 'orange' },
    { id: 'critical', label: 'Critical Concern', min: 0, max: 39, color: 'red' }
  ]
}
