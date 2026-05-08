export const defaultScoringConfig = {
  method: 'simple_percentage', // simple_percentage | weighted_section | weighted_question | deduction
  passThreshold: 75,
  naTreatment: 'exclude', // exclude | neutral
  criticalFailureCap: 50, // if a critical question fails, cap score at this
  criticalFailureMode: 'cap', // cap | flag (mark inspection as Critical Failure)
  bands: [
    { id: 'excellent', label: 'Excellent', min: 90, max: 100, color: 'emerald' },
    { id: 'good', label: 'Good', min: 75, max: 89, color: 'blue' },
    { id: 'needs', label: 'Needs Improvement', min: 60, max: 74, color: 'amber' },
    { id: 'poor', label: 'Poor', min: 40, max: 59, color: 'orange' },
    { id: 'critical', label: 'Critical Concern', min: 0, max: 39, color: 'red' }
  ]
}
