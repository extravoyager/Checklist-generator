// Programmatic generator for ~30+ pre-built EHS checklists.
// A few flagship ones are richly hand-authored; the remainder use templated patterns.

import { uid } from '../utils/downloadJson'

function q(text, opts = {}) {
  return {
    id: uid('q'),
    text,
    guidance: opts.guidance || '',
    responseType: opts.type || 'yes_no_na',
    required: opts.required ?? true,
    criticality: opts.criticality || 'standard', // standard | high | critical
    criticalControl: opts.cc || null,
    hazardCategory: opts.hazard || null,
    options: opts.options || null,
    weight: opts.weight || 1,
    flagOn: opts.flagOn || null,
    actionOnFlag: opts.action || false,
    evidenceRequired: opts.evidence || false
  }
}

function s(title, questions, opts = {}) {
  return { id: uid('s'), title, description: opts.description || '', weight: opts.weight || 1, questions }
}

// --- Flagship: Forklift Pre-Use Inspection ---
const forkliftPreUse = {
  title: 'Forklift Pre-Use Inspection',
  category: 'Asset/Equipment',
  industry: 'Logistics & Warehousing',
  riskTags: ['mobile-plant', 'lifting'],
  sections: [
    s('Operator & Documentation', [
      q('Is the operator licensed and authorised to operate this forklift?', { criticality: 'critical', cc: 'cc-traffic', hazard: 'mobile-plant' }),
      q('Has the daily pre-use checklist been completed and signed?', { criticality: 'high' }),
      q('Are operator manuals accessible on the unit?'),
      q('Operator name', { type: 'text', criticality: 'standard', evidence: false })
    ]),
    s('Tyres, Brakes & Steering', [
      q('Tyre pressure and condition acceptable (no significant wear, cuts, or splits)?', { criticality: 'high', hazard: 'mobile-plant' }),
      q('Service brake operates correctly?', { criticality: 'critical' }),
      q('Park brake holds the unit on a slope?', { criticality: 'critical' }),
      q('Steering wheel free play within tolerance?', { criticality: 'high' })
    ]),
    s('Hydraulics & Mast', [
      q('Mast raises and lowers smoothly without jerking?', { criticality: 'high' }),
      q('Tilt cylinders functional with no leaks?', { criticality: 'high' }),
      q('Forks free of cracks, twists, or excessive wear?', { criticality: 'critical', hazard: 'lifting' }),
      q('Load backrest extension secure and undamaged?'),
      q('Hydraulic oil level adequate (no visible leaks)?')
    ]),
    s('Safety Devices', [
      q('Seatbelt operational and worn?', { criticality: 'critical', cc: 'cc-traffic' }),
      q('Horn audible from 10m?', { criticality: 'high' }),
      q('Reverse alarm and beacon functional?', { criticality: 'high' }),
      q('Overhead guard intact and free of damage?', { criticality: 'critical' }),
      q('Fire extinguisher present, charged, and in date?', { cc: 'cc-emergency', hazard: 'fire' })
    ]),
    s('Battery / Fuel & Environment', [
      q('Battery secured and connections clean (electric)?'),
      q('Fuel/LPG cylinder secure and within shelf life?'),
      q('Working area free of pedestrians and obstructions?', { criticality: 'high', cc: 'cc-traffic' }),
      q('Defects or concerns identified during inspection?', { type: 'long_text', required: false, flagOn: 'has_text' })
    ])
  ]
}

// --- Flagship: Work at Height Critical Control Verification ---
const workAtHeight = {
  title: 'Work at Height Critical Control Verification',
  category: 'High-Risk Work',
  industry: 'Construction',
  riskTags: ['work-at-height'],
  sections: [
    s('Permit & Risk Assessment', [
      q('Valid Work at Height permit on site and signed by all parties?', { criticality: 'critical' }),
      q('JSA / risk assessment reviewed with the crew today?', { criticality: 'high' }),
      q('Rescue plan documented and rehearsed?', { criticality: 'critical' }),
      q('Weather conditions within permit limits (wind, lightning, visibility)?', { criticality: 'high' })
    ]),
    s('Edge Protection & Access', [
      q('Guardrails compliant (top rail, mid rail, toe board) where required?', { criticality: 'critical', cc: 'cc-edge-protection', hazard: 'work-at-height' }),
      q('Floor openings covered, secured, and signed?', { criticality: 'critical' }),
      q('Ladders/scaffolds inspected and tagged within validity period?', { criticality: 'high' }),
      q('Scaffold tag visible, current, and signed by competent person?', { criticality: 'critical' })
    ]),
    s('Personal Fall Protection', [
      q('Workers wearing full body harness in good condition (no cuts, fraying, UV damage)?', { criticality: 'critical', cc: 'cc-fall-protection' }),
      q('Lanyards/SRLs anchored above the dorsal D-ring where possible?', { criticality: 'high', cc: 'cc-fall-protection' }),
      q('Anchor points rated >= 22kN and certified?', { criticality: 'critical', cc: 'cc-fall-protection' }),
      q('Free-fall distance calculated and clearance verified?', { criticality: 'critical' }),
      q('Tools secured against drops (lanyards, tool buckets)?', { criticality: 'high' })
    ]),
    s('Drop Zone & Communication', [
      q('Drop zone barricaded with signage and a spotter?', { criticality: 'high' }),
      q('Two-way communication functional between worker and ground crew?'),
      q('Emergency contact number displayed at the access point?'),
      q('Photographic evidence of harness inspection captured?', { type: 'photo', required: false, evidence: true })
    ])
  ]
}

// --- Flagship: Daily Site Safety Walkthrough ---
const dailyWalkthrough = {
  title: 'Daily Site Safety Walkthrough',
  category: 'General Safety',
  industry: 'Construction',
  riskTags: ['housekeeping', 'ppe', 'work-at-height', 'mobile-plant'],
  sections: [
    s('Site Entry & Briefing', [
      q('Site induction up to date for all workers on site?', { criticality: 'high' }),
      q('Pre-start briefing held with all crews this morning?'),
      q('Visitors signed in and escorted?'),
      q('Emergency assembly point clearly marked?')
    ]),
    s('PPE & Behaviours', [
      q('All workers wearing site-mandated PPE (hard hat, safety glasses, hi-vis, boots)?', { criticality: 'high', hazard: 'ppe' }),
      q('Task-specific PPE worn where required (gloves, hearing, respiratory)?', { criticality: 'high' }),
      q('Behavioural observations - any at-risk behaviours noted?', { type: 'safe_at_risk_na', criticality: 'high', flagOn: 'At Risk', action: true })
    ]),
    s('Housekeeping & Access', [
      q('Walkways clear of trip hazards and debris?', { hazard: 'housekeeping' }),
      q('Materials stored safely, not blocking egress?'),
      q('Waste bins available and not overflowing?'),
      q('Lighting adequate in all work areas?')
    ]),
    s('High-Risk Activities Today', [
      q('All permits to work valid and on display where work is occurring?', { criticality: 'critical' }),
      q('Work at height controls verified at active locations?', { criticality: 'high', hazard: 'work-at-height' }),
      q('Plant and pedestrian segregation observed and effective?', { criticality: 'high', cc: 'cc-traffic' }),
      q('Hot work, confined space, or excavation activity observed safely?', { criticality: 'high' })
    ]),
    s('Findings', [
      q('Outstanding actions from yesterday closed out?'),
      q('New findings or concerns noted today?', { type: 'long_text', required: false, flagOn: 'has_text', action: true })
    ])
  ]
}

// --- Templated patterns for the rest ---

function genericInspection(title, category, riskTags, industry = 'General') {
  return {
    title, category, industry, riskTags,
    sections: [
      s('Pre-Inspection', [
        q('Inspector competent and authorised for this inspection?', { criticality: 'high' }),
        q('All previous outstanding actions reviewed?'),
        q('Required documentation and references on hand?')
      ]),
      s('Hazard Identification', [
        q('Are all hazards relevant to ' + title.toLowerCase() + ' identified and controlled?', { criticality: 'high' }),
        q('Risk assessment current and accessible?'),
        q('Critical controls verified in place and effective?', { criticality: 'critical' }),
        q('Workers briefed on hazards and controls today?')
      ]),
      s('Compliance Checks', [
        q('Procedure followed as documented?', { criticality: 'high' }),
        q('Required training and certifications current for personnel involved?'),
        q('Equipment fit for purpose and within service intervals?'),
        q('PPE appropriate, available, and being worn correctly?')
      ]),
      s('Observations & Findings', [
        q('Any near misses or unsafe conditions observed?', { type: 'safe_at_risk_na', flagOn: 'At Risk', action: true }),
        q('Comments / additional notes', { type: 'long_text', required: false }),
        q('Photographic evidence captured', { type: 'photo', required: false, evidence: true })
      ])
    ]
  }
}

function permitVerification(title, hazardId, ccId) {
  return {
    title, category: 'High-Risk Work', industry: 'General', riskTags: [hazardId],
    sections: [
      s('Permit Validity', [
        q('Permit issued by an authorised person for the correct task and location?', { criticality: 'critical', cc: ccId, hazard: hazardId }),
        q('All sections of the permit completed legibly?', { criticality: 'high' }),
        q('Permit duration valid for current work window?', { criticality: 'high' }),
        q('Pre-task briefing recorded with all involved personnel?', { criticality: 'high' })
      ]),
      s('Critical Controls Verification', [
        q('All critical controls listed on the permit verified in field?', { criticality: 'critical', cc: ccId }),
        q('Isolation points tagged, locked, and verified zero energy where applicable?', { criticality: 'critical', hazard: 'electrical' }),
        q('Emergency response equipment available and operable?', { criticality: 'high', cc: 'cc-emergency' }),
        q('Atmospheric / environmental conditions monitored as required?', { criticality: 'high' })
      ]),
      s('Personnel & PPE', [
        q('All workers competent and authorised?', { criticality: 'high' }),
        q('Task-specific PPE worn correctly?', { hazard: 'ppe' }),
        q('Stand-by person / fire watch / rescue team in position?', { criticality: 'critical' })
      ]),
      s('Close-out', [
        q('Permit signed off at end of work and area returned to safe state?', { criticality: 'high' }),
        q('Any deviations or follow-up actions identified?', { type: 'long_text', required: false, flagOn: 'has_text', action: true })
      ])
    ]
  }
}

function vehicleInspection(title, assetType) {
  return {
    title, category: 'Asset/Equipment', industry: 'General', riskTags: ['mobile-plant'],
    sections: [
      s('Documentation & Operator', [
        q('Operator licensed and competent for ' + assetType + '?', { criticality: 'critical' }),
        q('Pre-use checklist completed today?'),
        q('Service / maintenance records up to date?')
      ]),
      s('Walk-around Inspection', [
        q('Tyres in good condition, correct pressure?', { criticality: 'high' }),
        q('Lights, indicators, and reflectors functional?', { criticality: 'high' }),
        q('No visible leaks (oil, hydraulic, fuel, coolant)?'),
        q('Glass and mirrors intact and clean?')
      ]),
      s('Brakes & Controls', [
        q('Service brake responsive and effective?', { criticality: 'critical' }),
        q('Park brake holds vehicle on incline?', { criticality: 'critical' }),
        q('Steering free of excessive play?'),
        q('Reverse alarm and horn audible?', { criticality: 'high' })
      ]),
      s('Safety Equipment', [
        q('Seatbelts present and functional in all seating positions?', { criticality: 'critical' }),
        q('Fire extinguisher charged and accessible?', { cc: 'cc-emergency' }),
        q('First aid kit stocked and in date?'),
        q('Defects identified', { type: 'long_text', required: false, flagOn: 'has_text', action: true })
      ])
    ]
  }
}

function environmentalInspection(title) {
  return {
    title, category: 'Environmental', industry: 'General', riskTags: ['environmental', 'chemical'],
    sections: [
      s('Storage & Containment', [
        q('Chemical and waste storage areas bunded and secure?', { criticality: 'high', cc: 'cc-chem-storage', hazard: 'chemical' }),
        q('Containers labelled correctly with current SDS available?', { criticality: 'high' }),
        q('Incompatible chemicals segregated?', { criticality: 'high' }),
        q('Storage volumes within site permit limits?')
      ]),
      s('Spill Prevention', [
        q('Spill kits available, stocked, and inspected?', { criticality: 'high' }),
        q('Drains protected from accidental release?', { criticality: 'high', hazard: 'environmental' }),
        q('Loading/unloading areas have spill containment?'),
        q('Personnel trained in spill response?')
      ]),
      s('Waste Management', [
        q('Waste streams segregated correctly?', { hazard: 'environmental' }),
        q('Hazardous waste manifests completed and on file?'),
        q('Waste contractors licensed and tracked?')
      ]),
      s('General Environmental', [
        q('Air emissions points compliant with permit?'),
        q('Stormwater discharge clear of contamination?'),
        q('Findings and actions', { type: 'long_text', required: false, flagOn: 'has_text', action: true })
      ])
    ]
  }
}

const flagshipChecklists = [forkliftPreUse, workAtHeight, dailyWalkthrough]

const templatedSpecs = [
  // General Safety
  ['Weekly Workplace Safety Inspection', 'General Safety', ['housekeeping', 'ppe'], 'generic'],
  ['Housekeeping Inspection', 'General Safety', ['housekeeping'], 'generic'],
  ['PPE Compliance Inspection', 'General Safety', ['ppe'], 'generic'],
  ['Behavioural Safety Observation', 'General Safety', ['housekeeping', 'ppe'], 'generic'],
  ['Supervisor Safety Conversation Checklist', 'General Safety', ['housekeeping'], 'generic'],
  // High-Risk Work
  ['Electrical Isolation / LOTO Verification', 'High-Risk Work', ['electrical'], 'permit', 'electrical', 'cc-loto'],
  ['Confined Space Entry Readiness', 'High-Risk Work', ['confined-space'], 'permit', 'confined-space', 'cc-cs-permit'],
  ['Hot Work Permit Verification', 'High-Risk Work', ['hot-work'], 'permit', 'hot-work', 'cc-hot-work-permit'],
  ['Lifting Operations Inspection', 'High-Risk Work', ['lifting'], 'permit', 'lifting', 'cc-lift-plan'],
  ['Excavation Safety Inspection', 'High-Risk Work', ['excavation'], 'permit', 'excavation', 'cc-shoring'],
  ['Temporary Works Inspection', 'High-Risk Work', ['work-at-height'], 'generic'],
  ['Stored Energy Control Verification', 'High-Risk Work', ['electrical'], 'permit', 'electrical', 'cc-loto'],
  // Asset / Equipment
  ['Vehicle Pre-Use Inspection', 'Asset/Equipment', ['mobile-plant'], 'vehicle', 'Vehicle'],
  ['Mobile Plant Inspection', 'Asset/Equipment', ['mobile-plant'], 'vehicle', 'Mobile Plant'],
  ['Machine Guarding Inspection', 'Asset/Equipment', ['machine-guarding'], 'generic'],
  ['Emergency Equipment Inspection', 'Asset/Equipment', ['fire'], 'generic'],
  ['Fire Extinguisher Inspection', 'Asset/Equipment', ['fire'], 'generic'],
  // Contractor / Permit
  ['Contractor Safety Audit', 'Contractor/Permit', ['contractor'], 'generic'],
  ['Permit to Work Field Verification', 'Contractor/Permit', ['contractor'], 'generic'],
  ['JSA Review', 'Contractor/Permit', ['contractor'], 'generic'],
  ['Toolbox Talk Quality Check', 'Contractor/Permit', ['contractor'], 'generic'],
  // Incident / Risk
  ['Near Miss Initial Review', 'Incident/Risk', ['housekeeping'], 'generic'],
  ['Incident Scene Preservation', 'Incident/Risk', ['housekeeping'], 'generic'],
  ['Incident Investigation Prep', 'Incident/Risk', ['housekeeping'], 'generic'],
  ['Critical Control Failure Review', 'Incident/Risk', ['work-at-height', 'electrical'], 'generic'],
  ['Risk Assessment Quality Review', 'Incident/Risk', ['housekeeping'], 'generic'],
  // Environmental
  ['Chemical Storage Inspection', 'Environmental', ['chemical'], 'environmental'],
  ['Spill Prevention Inspection', 'Environmental', ['environmental'], 'environmental'],
  ['Waste Management Inspection', 'Environmental', ['environmental'], 'environmental'],
  ['Environmental Site Walkthrough', 'Environmental', ['environmental'], 'environmental']
]

function buildAll() {
  const list = flagshipChecklists.map(c => ({ ...c, isPreBuilt: true, status: 'prebuilt' }))
  for (const spec of templatedSpecs) {
    const [title, category, tags, kind, ...rest] = spec
    let tpl
    if (kind === 'permit') tpl = permitVerification(title, rest[0], rest[1])
    else if (kind === 'vehicle') tpl = vehicleInspection(title, rest[0])
    else if (kind === 'environmental') tpl = environmentalInspection(title)
    else tpl = genericInspection(title, category, tags)
    list.push({ ...tpl, category, riskTags: tags, isPreBuilt: true, status: 'prebuilt' })
  }
  return list.map((t, i) => {
    const sections = t.sections
    const questionCount = sections.reduce((acc, s) => acc + s.questions.length, 0)
    return {
      id: 'pb-' + (i + 1).toString().padStart(3, '0'),
      title: t.title,
      description: t.description || (t.category + ' inspection template'),
      category: t.category,
      industry: t.industry || 'General',
      riskTags: t.riskTags || [],
      sections,
      sectionCount: sections.length,
      questionCount,
      version: '1.0',
      status: 'prebuilt',
      isPreBuilt: true,
      createdAt: new Date(2024, 5 + (i % 6), 1 + (i % 25)).toISOString(),
      updatedAt: new Date(2024, 8 + (i % 4), 1 + (i % 25)).toISOString(),
      author: 'CheckWise Library'
    }
  })
}

export const preBuiltChecklists = buildAll()
