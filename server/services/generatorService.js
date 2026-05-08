// Server mirror of the deterministic generator.
const sectionPatterns = {
  'work-at-height': ['Permit & Risk Assessment', 'Edge Protection & Access', 'Personal Fall Protection', 'Drop Zone & Communication'],
  'electrical': ['Isolation & LOTO', 'Earthing & Grounding', 'Test & Verify Dead', 'Restoration of Energy'],
  'mobile-plant': ['Operator Authorisation', 'Pre-Use Walkaround', 'Brakes & Controls', 'Segregation & Movement'],
  'housekeeping': ['Walkways & Egress', 'Storage & Stacking', 'Waste & Recycling', 'Lighting & Visibility'],
  'ppe': ['Mandatory PPE', 'Task-Specific PPE', 'PPE Condition', 'Training & Compliance']
}

const questionPatterns = {
  'work-at-height': ['Permit valid?', 'Anchor points certified?', 'Harness inspected?', 'Edge protection compliant?'],
  'electrical': ['Isolation point identified?', 'Lockout applied?', 'Stored energy dissipated?', 'Tested for dead?'],
  'mobile-plant': ['Operator licensed?', 'Brakes/horn/lights operational?', 'Seatbelt worn?', 'Segregation in place?'],
  'housekeeping': ['Walkways clear?', 'Materials stacked safely?', 'Waste managed?', 'Lighting adequate?'],
  'ppe': ['Mandatory PPE worn?', 'Task PPE matches risk?', 'PPE in good condition?', 'Workers trained on PPE?']
}

let counter = 1
const uid = (p) => p + '-' + (counter++).toString(36) + Math.random().toString(36).slice(2, 6)

export function generateChecklist(input) {
  const { title = 'Generated Template', riskFocus = ['housekeeping','ppe'], depth = 'Standard', sections: sCount = null, questionsPerSection: qpsIn = null } = input
  const dm = { Basic: 0.6, Standard: 1, Advanced: 1.5 }[depth] || 1
  const focuses = riskFocus.length ? riskFocus : ['housekeeping','ppe']
  const sCountFinal = sCount || focuses.length
  const qps = qpsIn || Math.round(4 * dm)
  const sections = []
  for (let i = 0; i < sCountFinal; i++) {
    const f = focuses[i % focuses.length]
    const titles = sectionPatterns[f] || ['General Compliance']
    const qs = questionPatterns[f] || ['Compliance verified?']
    const questions = []
    const qN = Math.max(2, Math.min(qs.length, Math.round(qps + (i % 2))))
    for (let j = 0; j < qN; j++) {
      questions.push({ id: uid('q'), text: qs[j % qs.length], responseType: 'yes_no_na', required: true,
        criticality: j === 0 ? 'high' : 'standard', hazardCategory: f, weight: 1 })
    }
    sections.push({ id: uid('s'), title: titles[i % titles.length], weight: 1, questions })
  }
  const questionCount = sections.reduce((a, s) => a + s.questions.length, 0)
  return { id: uid('tpl'), title, sections, sectionCount: sections.length, questionCount, status: 'draft', isPreBuilt: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
}
