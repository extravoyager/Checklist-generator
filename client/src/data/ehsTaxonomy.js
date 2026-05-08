// EHS hazard taxonomy, critical controls, and asset/site references

export const hazardCategories = [
  { id: 'work-at-height', label: 'Work at Height', color: 'red' },
  { id: 'electrical', label: 'Electrical / Energy', color: 'amber' },
  { id: 'confined-space', label: 'Confined Space', color: 'red' },
  { id: 'hot-work', label: 'Hot Work', color: 'orange' },
  { id: 'lifting', label: 'Lifting Operations', color: 'blue' },
  { id: 'excavation', label: 'Excavation', color: 'amber' },
  { id: 'mobile-plant', label: 'Mobile Plant / Vehicles', color: 'blue' },
  { id: 'machine-guarding', label: 'Machine Guarding', color: 'slate' },
  { id: 'chemical', label: 'Chemical Hazards', color: 'purple' },
  { id: 'noise', label: 'Noise', color: 'slate' },
  { id: 'manual-handling', label: 'Manual Handling', color: 'slate' },
  { id: 'fire', label: 'Fire / Emergency', color: 'red' },
  { id: 'environmental', label: 'Environmental', color: 'emerald' },
  { id: 'housekeeping', label: 'Housekeeping', color: 'slate' },
  { id: 'ppe', label: 'PPE / Compliance', color: 'blue' },
  { id: 'contractor', label: 'Contractor Management', color: 'amber' }
]

export const criticalControls = [
  { id: 'cc-fall-protection', label: 'Fall Protection System', hazardId: 'work-at-height' },
  { id: 'cc-edge-protection', label: 'Edge Protection / Guardrails', hazardId: 'work-at-height' },
  { id: 'cc-loto', label: 'Lockout/Tagout (LOTO)', hazardId: 'electrical' },
  { id: 'cc-grounding', label: 'Earthing & Grounding', hazardId: 'electrical' },
  { id: 'cc-cs-permit', label: 'Confined Space Permit', hazardId: 'confined-space' },
  { id: 'cc-atmosphere', label: 'Atmospheric Monitoring', hazardId: 'confined-space' },
  { id: 'cc-hot-work-permit', label: 'Hot Work Permit + Fire Watch', hazardId: 'hot-work' },
  { id: 'cc-lift-plan', label: 'Lift Plan & Exclusion Zone', hazardId: 'lifting' },
  { id: 'cc-shoring', label: 'Shoring / Trench Protection', hazardId: 'excavation' },
  { id: 'cc-traffic', label: 'Pedestrian/Vehicle Segregation', hazardId: 'mobile-plant' },
  { id: 'cc-guarding', label: 'Fixed & Interlocked Guarding', hazardId: 'machine-guarding' },
  { id: 'cc-chem-storage', label: 'Chemical Storage Containment', hazardId: 'chemical' },
  { id: 'cc-emergency', label: 'Emergency Response Equipment', hazardId: 'fire' }
]

export const industries = [
  'Construction', 'Manufacturing', 'Oil & Gas', 'Mining', 'Logistics & Warehousing',
  'Utilities', 'Food & Beverage', 'Healthcare', 'Chemicals', 'Renewable Energy'
]

export const siteTypes = [
  'Construction Site', 'Manufacturing Plant', 'Distribution Centre', 'Refinery',
  'Mine Site', 'Substation', 'Office', 'Workshop', 'Wind Farm', 'Solar Farm'
]

export const responseTypes = [
  { id: 'yes_no_na', label: 'Yes / No / N/A', flagged: ['No'] },
  { id: 'pass_fail_na', label: 'Pass / Fail / N/A', flagged: ['Fail'] },
  { id: 'safe_at_risk_na', label: 'Safe / At Risk / N/A', flagged: ['At Risk'] },
  { id: 'multiple_choice', label: 'Multiple Choice (single)' },
  { id: 'checkbox', label: 'Checkbox (multi)' },
  { id: 'text', label: 'Short Text' },
  { id: 'long_text', label: 'Long Text / Notes' },
  { id: 'number', label: 'Number' },
  { id: 'date', label: 'Date' },
  { id: 'time', label: 'Time' },
  { id: 'photo', label: 'Photo Evidence' },
  { id: 'signature', label: 'Signature' },
  { id: 'asset_select', label: 'Asset Selector' },
  { id: 'location', label: 'Location' },
  { id: 'reading', label: 'Instrument Reading' }
]
