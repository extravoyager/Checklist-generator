// Deterministic local checklist generator.
// Inputs: { title, industry, siteType, objective, riskFocus[], criticalControls[], depth, sections, questionsPerSection, scoringOn, evidenceRequired, autoActions }

import { uid } from '../utils/downloadJson'
import { hazardCategories, criticalControls as ccTaxonomy } from '../data/ehsTaxonomy'

const sectionPatterns = {
  'work-at-height': ['Permit & Risk Assessment', 'Edge Protection & Access', 'Personal Fall Protection', 'Drop Zone & Communication'],
  'electrical': ['Isolation & LOTO', 'Earthing & Grounding', 'Test & Verify Dead', 'Restoration of Energy'],
  'confined-space': ['Permit & Pre-Entry', 'Atmospheric Monitoring', 'Entry & Egress', 'Rescue Readiness'],
  'hot-work': ['Permit Conditions', 'Fire Watch Setup', 'Combustible Control', 'Post-Work Monitoring'],
  'lifting': ['Lift Plan & Equipment', 'Operator & Rigger', 'Exclusion Zone', 'Load & Path'],
  'excavation': ['Permit & Services', 'Shoring & Battering', 'Access & Egress', 'Spoil & Edge Control'],
  'mobile-plant': ['Operator Authorisation', 'Pre-Use Walkaround', 'Brakes & Controls', 'Segregation & Movement'],
  'machine-guarding': ['Fixed Guards', 'Interlocks', 'E-Stops', 'Operator Behaviour'],
  'chemical': ['Storage & Containment', 'Labelling & SDS', 'Handling & PPE', 'Spill Response'],
  'fire': ['Detection Systems', 'Suppression Systems', 'Egress & Lighting', 'Drills & Training'],
  'environmental': ['Air & Emissions', 'Water & Stormwater', 'Waste Streams', 'Spill Prevention'],
  'housekeeping': ['Walkways & Egress', 'Storage & Stacking', 'Waste & Recycling', 'Lighting & Visibility'],
  'ppe': ['Mandatory PPE', 'Task-Specific PPE', 'PPE Condition', 'Training & Compliance'],
  'manual-handling': ['Task Design', 'Lifting Technique', 'Mechanical Aids', 'Pacing & Rotation'],
  'noise': ['Source Controls', 'Hearing Protection', 'Exposure Monitoring', 'Signage & Zones'],
  'contractor': ['Pre-Mobilisation', 'On-Site Compliance', 'Permit Adherence', 'Performance Review']
}

const questionPatterns = {
  'work-at-height': [
    'Permit valid and on display?', 'Anchor points rated and certified?', 'Harness inspected and within service date?',
    'Edge protection compliant (top/mid rail/toe board)?', 'Drop zone barricaded with spotter?'
  ],
  'electrical': [
    'Isolation point identified and tagged?', 'Lockout device applied and verified?', 'Stored energy dissipated?',
    'Test for dead performed with proven instrument?', 'Authorised electrical worker performing task?'
  ],
  'confined-space': [
    'Permit issued and conditions met?', 'Atmospheric tests conducted (O2, LEL, toxics)?',
    'Standby person in position with comms?', 'Rescue plan rehearsed and equipment in place?'
  ],
  'hot-work': [
    'Hot work permit valid and conditions met?', 'Combustibles removed within 11m radius?',
    'Fire watch posted with appropriate extinguisher?', 'Post-work fire watch maintained for 30+ minutes?'
  ],
  'lifting': [
    'Lift plan completed and reviewed?', 'Crane / lifting gear within current inspection?',
    'Tag lines used and exclusion zone enforced?', 'Operator and rigger competent and authorised?'
  ],
  'excavation': [
    'Underground services located and marked?', 'Shoring or battering correctly installed?',
    'Safe access (ladder/ramp) within 7.5m?', 'Spoil set back at least 1m from edge?'
  ],
  'mobile-plant': [
    'Operator licensed and pre-use check complete?', 'Brakes, horn, lights, mirrors functional?',
    'Seatbelt worn and operable?', 'Pedestrian / vehicle segregation in place?'
  ],
  'machine-guarding': [
    'Fixed guards in place and undamaged?', 'Interlocks tested and functional?',
    'E-stops accessible and tested?', 'Operators trained and following SOP?'
  ],
  'chemical': [
    'Containers labelled and SDS available?', 'Bunding adequate and free of contamination?',
    'Incompatible chemicals segregated?', 'PPE appropriate for handling tasks?'
  ],
  'fire': [
    'Detection / alarm systems serviced and signed off?', 'Extinguishers in date and accessible?',
    'Egress routes unobstructed and lit?', 'Drills conducted within frequency?'
  ],
  'environmental': [
    'Emission points within permit limits?', 'Stormwater pathways uncontaminated?',
    'Waste segregated and tracked?', 'Spill kits available and stocked?'
  ],
  'housekeeping': [
    'Walkways clear of trip hazards?', 'Materials stacked safely?',
    'Bins available and not overflowing?', 'Lighting adequate for tasks?'
  ],
  'ppe': [
    'Mandatory PPE worn (hat, glasses, hi-vis, boots)?', 'Task PPE matches risk assessment?',
    'PPE in serviceable condition (no defects)?', 'Workers trained in correct PPE use?'
  ],
  'manual-handling': [
    'Loads assessed for weight and shape?', 'Mechanical aids available and used?',
    'Lifting technique observed correct?', 'Task rotation in place to limit exposure?'
  ],
  'noise': [
    'Noise levels measured and within limit?', 'Hearing protection worn in zones >85dB?',
    'Hearing protection condition acceptable?', 'Signage in place at zone boundaries?'
  ],
  'contractor': [
    'Pre-mobilisation checks completed?', 'Permits in place for all activities?',
    'Toolbox talks documented today?', 'JSAs reviewed with crews?'
  ]
}

export function generateChecklist(input) {
  const {
    title, industry = 'General', siteType = '', objective = '',
    riskFocus = [], criticalControls = [], depth = 'Standard',
    sections: sectionsCount = null, questionsPerSection: qps = null,
    scoringOn = true, evidenceRequired = false, autoActions = true
  } = input

  const depthMultiplier = { Basic: 0.6, Standard: 1, Advanced: 1.5 }[depth] || 1
  const focuses = riskFocus.length ? riskFocus : ['housekeeping', 'ppe']

  const finalSectionCount = sectionsCount || focuses.length
  const baseQ = qps || Math.round(4 * depthMultiplier)

  const sections = []
  for (let i = 0; i < finalSectionCount; i++) {
    const focusId = focuses[i % focuses.length]
    const sectionTitles = sectionPatterns[focusId] || ['General Compliance']
    const sectionTitle = sectionTitles[i % sectionTitles.length]
    const qPatterns = questionPatterns[focusId] || ['General compliance verified?']
    const questions = []
    const qCount = Math.max(2, Math.min(qPatterns.length + 2, Math.round(baseQ + (i % 2))))
    for (let j = 0; j < qCount; j++) {
      const text = qPatterns[j % qPatterns.length]
      const isCritical = criticalControls.length && (j === 0)
      questions.push({
        id: uid('q'),
        text,
        guidance: '',
        responseType: 'yes_no_na',
        required: true,
        criticality: isCritical ? 'critical' : (j === 1 ? 'high' : 'standard'),
        criticalControl: isCritical ? criticalControls[0] : null,
        hazardCategory: focusId,
        weight: 1,
        evidenceRequired: evidenceRequired && j === 0,
        actionOnFlag: autoActions
      })
    }
    questions.push({
      id: uid('q'), text: 'Notes / observations', guidance: '',
      responseType: 'long_text', required: false, criticality: 'standard',
      hazardCategory: focusId, weight: 1
    })
    sections.push({ id: uid('s'), title: sectionTitle, description: '', weight: 1, questions })
  }

  const questionCount = sections.reduce((a, s) => a + s.questions.length, 0)
  return {
    id: uid('tpl'),
    title: title || 'Untitled Generated Template',
    description: objective || (siteType ? siteType + ' - ' + industry : industry),
    category: 'Generated',
    industry,
    riskTags: focuses,
    sections,
    sectionCount: sections.length,
    questionCount,
    version: '0.1',
    status: 'draft',
    isPreBuilt: false,
    scoringEnabled: scoringOn,
    author: 'Generator',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}
