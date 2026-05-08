import { preBuiltChecklists } from './preBuiltChecklists'
export { preBuiltChecklists }
import { defaultRoles } from './defaultRoles'
import { defaultScoringConfig } from './scoringDefaults'
import { hazardCategories, criticalControls } from './ehsTaxonomy'
export { hazardCategories, criticalControls }
import { uid } from '../utils/downloadJson'

// 12 demo users
export const users = [
  { id: 'u-001', name: 'Alex Reynolds', email: 'alex.reynolds@checkwise.demo', roleId: 'super-admin', siteId: null, initials: 'AR', color: '#3f6896' },
  { id: 'u-002', name: 'Priya Shah', email: 'priya.shah@checkwise.demo', roleId: 'ehs-admin', siteId: null, initials: 'PS', color: '#0e7490' },
  { id: 'u-003', name: 'Marcus Chen', email: 'marcus.chen@checkwise.demo', roleId: 'corporate-ehs', siteId: null, initials: 'MC', color: '#7c3aed' },
  { id: 'u-004', name: 'Linda Okafor', email: 'linda.okafor@checkwise.demo', roleId: 'regional-ehs', siteId: 's-001', initials: 'LO', color: '#b91c1c' },
  { id: 'u-005', name: 'Diego Alvarez', email: 'diego.alvarez@checkwise.demo', roleId: 'site-ehs', siteId: 's-002', initials: 'DA', color: '#047857' },
  { id: 'u-006', name: 'Sara Whitman', email: 'sara.whitman@checkwise.demo', roleId: 'site-manager', siteId: 's-002', initials: 'SW', color: '#d97706' },
  { id: 'u-007', name: 'Tom Becker', email: 'tom.becker@checkwise.demo', roleId: 'supervisor', siteId: 's-003', initials: 'TB', color: '#0369a1' },
  { id: 'u-008', name: 'Jenna Liu', email: 'jenna.liu@checkwise.demo', roleId: 'inspector', siteId: 's-002', initials: 'JL', color: '#be185d' },
  { id: 'u-009', name: 'Rashid Khan', email: 'rashid.khan@checkwise.demo', roleId: 'contractor-inspector', siteId: 's-004', initials: 'RK', color: '#65a30d' },
  { id: 'u-010', name: 'Olu Adebayo', email: 'olu.adebayo@checkwise.demo', roleId: 'template-builder', siteId: null, initials: 'OA', color: '#9333ea' },
  { id: 'u-011', name: 'Maya Patel', email: 'maya.patel@checkwise.demo', roleId: 'action-owner', siteId: 's-005', initials: 'MP', color: '#0d9488' },
  { id: 'u-012', name: 'Sam Jordan', email: 'sam.jordan@checkwise.demo', roleId: 'viewer', siteId: 's-006', initials: 'SJ', color: '#475569' }
]

export const regions = [
  { id: 'r-001', name: 'North America' },
  { id: 'r-002', name: 'EMEA' },
  { id: 'r-003', name: 'Asia Pacific' }
]

export const sites = [
  { id: 's-001', name: 'Houston Refinery', regionId: 'r-001', type: 'Refinery', address: 'Houston, TX' },
  { id: 's-002', name: 'Chicago Distribution Centre', regionId: 'r-001', type: 'Distribution Centre', address: 'Chicago, IL' },
  { id: 's-003', name: 'Manchester Plant', regionId: 'r-002', type: 'Manufacturing Plant', address: 'Manchester, UK' },
  { id: 's-004', name: 'Riyadh Construction Project', regionId: 'r-002', type: 'Construction Site', address: 'Riyadh, KSA' },
  { id: 's-005', name: 'Singapore Workshop', regionId: 'r-003', type: 'Workshop', address: 'Singapore' },
  { id: 's-006', name: 'Sydney Wind Farm', regionId: 'r-003', type: 'Wind Farm', address: 'New South Wales, AU' }
]

export const areas = [
  { id: 'a-01', siteId: 's-001', name: 'Process Unit A' }, { id: 'a-02', siteId: 's-001', name: 'Tank Farm' },
  { id: 'a-03', siteId: 's-002', name: 'Receiving Dock' }, { id: 'a-04', siteId: 's-002', name: 'Pick & Pack' },
  { id: 'a-05', siteId: 's-003', name: 'Press Shop' }, { id: 'a-06', siteId: 's-003', name: 'Paint Line' },
  { id: 'a-07', siteId: 's-004', name: 'Tower 3' }, { id: 'a-08', siteId: 's-004', name: 'Foundation Zone' },
  { id: 'a-09', siteId: 's-005', name: 'Maintenance Bay' }, { id: 'a-10', siteId: 's-005', name: 'Battery Room' },
  { id: 'a-11', siteId: 's-006', name: 'Turbine Cluster A' }, { id: 'a-12', siteId: 's-006', name: 'Substation' }
]

const assetTypes = [
  { type: 'Forklift', n: 6 }, { type: 'Vehicle', n: 4 }, { type: 'Press', n: 3 },
  { type: 'Fire Extinguisher', n: 5 }, { type: 'Crane', n: 2 }, { type: 'Generator', n: 2 },
  { type: 'Compressor', n: 2 }, { type: 'Conveyor', n: 1 }
]

function buildAssets() {
  const out = []; let i = 1
  for (const { type, n } of assetTypes) {
    for (let k = 0; k < n; k++) {
      const site = sites[(i + k) % sites.length]
      out.push({
        id: 'as-' + i.toString().padStart(3, '0'),
        name: type + ' ' + (k + 1).toString().padStart(2, '0'),
        type, siteId: site.id, areaId: areas.find(a => a.siteId === site.id)?.id || null,
        serial: 'SN-' + (1000 + i),
        nextServiceDate: new Date(Date.now() + (10 + i * 7) * 86400000).toISOString(),
        lastInspectionDate: new Date(Date.now() - (i * 3) * 86400000).toISOString(),
        status: i % 11 === 0 ? 'out_of_service' : 'in_service',
        readings: Array.from({ length: 12 }).map((_, m) => ({
          date: new Date(2024, m, 15).toISOString(),
          hours: 100 + m * 50 + (i % 5) * 10
        }))
      })
      i++
    }
  }
  return out
}

export const assets = buildAssets()

// Custom (user-authored) templates - mix of statuses
function buildCustomTemplates() {
  const base = preBuiltChecklists.slice(0, 10)
  const statuses = ['draft', 'published', 'published', 'draft', 'archived', 'published', 'draft', 'published', 'archived', 'published']
  return base.map((t, i) => ({
    ...JSON.parse(JSON.stringify(t)),
    id: 'tpl-' + (i + 1).toString().padStart(3, '0'),
    title: t.title + ' (Site Custom)',
    isPreBuilt: false,
    status: statuses[i],
    version: '1.' + (i + 1),
    author: users[(i + 2) % users.length].name,
    createdAt: new Date(Date.now() - (60 - i) * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - (10 - (i % 10)) * 86400000).toISOString()
  }))
}

export const customTemplates = buildCustomTemplates()

// Inspections - 40 varied
function buildInspections() {
  const list = []
  const allTemplates = [...preBuiltChecklists, ...customTemplates]
  const statuses = ['in_progress', 'completed', 'completed', 'completed', 'pending_approval', 'critical_failure', 'completed']
  for (let i = 0; i < 40; i++) {
    const tpl = allTemplates[i % allTemplates.length]
    const site = sites[i % sites.length]
    const inspector = users[3 + (i % 9)]
    const status = statuses[i % statuses.length]
    const totalQuestions = tpl.questionCount
    const answered = status === 'in_progress' ? Math.floor(totalQuestions * 0.6) : totalQuestions
    const score = status === 'critical_failure' ? 38 + (i % 10) : 60 + ((i * 7) % 35)
    const completedAt = status === 'in_progress' ? null : new Date(Date.now() - i * 86400000).toISOString()
    list.push({
      id: 'ins-' + (i + 1).toString().padStart(3, '0'),
      templateId: tpl.id,
      templateTitle: tpl.title,
      siteId: site.id,
      siteName: site.name,
      areaId: areas.find(a => a.siteId === site.id)?.id,
      assignedTo: inspector.id,
      assignedToName: inspector.name,
      status,
      progress: Math.round((answered / totalQuestions) * 100),
      score: status === 'in_progress' ? null : score,
      criticalFailures: status === 'critical_failure' ? 1 + (i % 3) : 0,
      flaggedCount: status === 'in_progress' ? 1 : 2 + (i % 5),
      startedAt: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
      completedAt,
      dueDate: new Date(Date.now() + ((i % 7) - 2) * 86400000).toISOString(),
      responses: {}
    })
  }
  return list
}

export const inspections = buildInspections()

const actionStatuses = ['open', 'in_progress', 'blocked', 'completed', 'verified']
const priorities = ['low', 'medium', 'high', 'critical']

function buildActions() {
  const list = []
  for (let i = 0; i < 80; i++) {
    const ins = inspections[i % inspections.length]
    const owner = users[3 + (i % 9)]
    const priority = priorities[i % 4]
    const status = actionStatuses[i % 5]
    const dueOffset = ((i * 3) % 30) - 12
    list.push({
      id: 'act-' + (i + 1).toString().padStart(3, '0'),
      title: [
        'Replace damaged guard on press', 'Recharge fire extinguisher in tank farm',
        'Reinstate edge protection on Tower 3 east side', 'Retrain forklift operator on segregation',
        'Repair forklift seatbelt buckle', 'Update LOTO procedure for compressor C-12',
        'Refill spill kit at receiving dock', 'Inspect harness lot 4423',
        'Replace missing scaffold tag on bay 7', 'Service emergency eyewash station'
      ][i % 10],
      description: 'Generated from inspection findings',
      priority, status,
      ownerId: owner.id, ownerName: owner.name,
      siteId: ins.siteId, siteName: ins.siteName,
      sourceInspectionId: ins.id,
      dueDate: new Date(Date.now() + dueOffset * 86400000).toISOString(),
      createdAt: new Date(Date.now() - (i % 30) * 86400000).toISOString(),
      verifiedAt: status === 'verified' ? new Date(Date.now() - (i % 10) * 86400000).toISOString() : null
    })
  }
  return list
}

export const actions = buildActions()

const findingTypes = ['observation', 'unsafe_act', 'unsafe_condition', 'near_miss', 'critical_control_failure']
const severities = ['low', 'medium', 'high', 'critical']

function buildFindings() {
  const list = []
  for (let i = 0; i < 60; i++) {
    const ins = inspections[i % inspections.length]
    const owner = users[3 + (i % 9)]
    const type = findingTypes[i % findingTypes.length]
    const severity = severities[i % 4]
    const sifPotential = severity === 'critical' || (i % 7 === 0)
    list.push({
      id: 'fnd-' + (i + 1).toString().padStart(3, '0'),
      title: [
        'Worker not tied off at height', 'Fire extinguisher overdue inspection',
        'Spill of hydraulic oil on dock', 'Forklift operating outside designated lane',
        'Unauthorised entry to confined space', 'Damaged fall arrest harness',
        'Excavation lacking shoring', 'Hot work conducted without permit'
      ][i % 8],
      description: 'Captured during inspection ' + ins.id,
      type, severity, sifPotential,
      hazardCategory: hazardCategories[i % hazardCategories.length].id,
      siteId: ins.siteId, siteName: ins.siteName,
      sourceInspectionId: ins.id,
      reportedBy: owner.name,
      reportedAt: new Date(Date.now() - (i % 40) * 86400000).toISOString(),
      status: ['open', 'in_review', 'closed'][i % 3]
    })
  }
  return list
}

export const findings = buildFindings()

export const dashboardKpis = {
  inspectionsDue: 14,
  inProgress: inspections.filter(i => i.status === 'in_progress').length,
  completedThisWeek: 22,
  openActions: actions.filter(a => ['open','in_progress','blocked'].includes(a.status)).length,
  overdueActions: actions.filter(a => ['open','in_progress','blocked'].includes(a.status) && new Date(a.dueDate) < new Date()).length,
  avgScore: 78,
  criticalFailures: inspections.filter(i => i.status === 'critical_failure').length
}

export const seedBundle = {
  users, regions, sites, areas, assets,
  preBuiltChecklists, customTemplates,
  inspections, actions, findings,
  roles: defaultRoles,
  scoringConfig: defaultScoringConfig,
  hazardCategories, criticalControls,
  dashboardKpis
}
