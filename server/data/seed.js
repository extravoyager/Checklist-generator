// Server-side seed data. Mirrors the logical data shape used in the client.

const hazardCategories = [
  { id: 'work-at-height', label: 'Work at Height' },
  { id: 'electrical', label: 'Electrical / Energy' },
  { id: 'confined-space', label: 'Confined Space' },
  { id: 'hot-work', label: 'Hot Work' },
  { id: 'lifting', label: 'Lifting Operations' },
  { id: 'mobile-plant', label: 'Mobile Plant / Vehicles' },
  { id: 'machine-guarding', label: 'Machine Guarding' },
  { id: 'chemical', label: 'Chemical Hazards' },
  { id: 'fire', label: 'Fire / Emergency' },
  { id: 'environmental', label: 'Environmental' },
  { id: 'housekeeping', label: 'Housekeeping' },
  { id: 'ppe', label: 'PPE / Compliance' }
]

const allPermissions = [
  'template.view', 'template.create', 'template.edit', 'template.publish', 'template.duplicate', 'template.delete', 'template.archive',
  'inspection.view', 'inspection.create', 'inspection.run', 'inspection.complete', 'inspection.approve', 'inspection.delete',
  'action.view', 'action.create', 'action.edit', 'action.close', 'action.verify', 'action.delete',
  'finding.view', 'finding.create', 'finding.edit', 'finding.delete',
  'analytics.view', 'analytics.export', 'asset.view', 'asset.edit',
  'admin.view', 'admin.manage_users', 'admin.manage_sites', 'admin.manage_assets', 'admin.manage_taxonomy', 'admin.manage_roles', 'admin.scoring', 'admin.branding'
]

const roles = [
  { id: 'super-admin', name: 'Super Admin', permissions: allPermissions },
  { id: 'ehs-admin', name: 'EHS Admin', permissions: allPermissions.filter(p => p !== 'admin.manage_roles') },
  { id: 'corporate-ehs', name: 'Corporate EHS Manager', permissions: ['template.view','template.create','template.edit','template.publish','template.duplicate','template.archive','inspection.view','inspection.approve','action.view','action.edit','action.verify','finding.view','finding.edit','analytics.view','analytics.export','asset.view','admin.view','admin.scoring'] },
  { id: 'regional-ehs', name: 'Regional EHS Manager', permissions: ['template.view','template.duplicate','inspection.view','inspection.approve','action.view','action.edit','action.verify','finding.view','finding.edit','analytics.view','asset.view'] },
  { id: 'site-ehs', name: 'Site EHS Manager', permissions: ['template.view','template.create','template.edit','template.duplicate','template.publish','inspection.view','inspection.create','inspection.run','inspection.complete','inspection.approve','action.view','action.create','action.edit','action.close','action.verify','finding.view','finding.create','finding.edit','analytics.view','asset.view'] },
  { id: 'site-manager', name: 'Site Manager', permissions: ['template.view','inspection.view','inspection.create','inspection.run','inspection.complete','action.view','action.create','action.edit','action.close','finding.view','analytics.view','asset.view'] },
  { id: 'supervisor', name: 'Supervisor', permissions: ['template.view','inspection.view','inspection.create','inspection.run','inspection.complete','action.view','action.create','action.edit','finding.view','asset.view'] },
  { id: 'inspector', name: 'Inspector', permissions: ['template.view','inspection.view','inspection.create','inspection.run','inspection.complete','action.view','action.create','finding.view','finding.create','asset.view'] },
  { id: 'contractor-inspector', name: 'Contractor Inspector', permissions: ['template.view','inspection.view','inspection.run','inspection.complete','action.view','action.create','finding.view','asset.view'] },
  { id: 'template-builder', name: 'Template Builder', permissions: ['template.view','template.create','template.edit','template.publish','template.duplicate','template.archive','inspection.view'] },
  { id: 'action-owner', name: 'Action Owner', permissions: ['action.view','action.edit','action.close','finding.view','inspection.view'] },
  { id: 'viewer', name: 'Viewer', permissions: ['template.view','inspection.view','action.view','finding.view','analytics.view','asset.view'] }
]

const users = [
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

const sites = [
  { id: 's-001', name: 'Houston Refinery', regionId: 'r-001', type: 'Refinery', address: 'Houston, TX' },
  { id: 's-002', name: 'Chicago Distribution Centre', regionId: 'r-001', type: 'Distribution Centre', address: 'Chicago, IL' },
  { id: 's-003', name: 'Manchester Plant', regionId: 'r-002', type: 'Manufacturing Plant', address: 'Manchester, UK' },
  { id: 's-004', name: 'Riyadh Construction Project', regionId: 'r-002', type: 'Construction Site', address: 'Riyadh, KSA' },
  { id: 's-005', name: 'Singapore Workshop', regionId: 'r-003', type: 'Workshop', address: 'Singapore' },
  { id: 's-006', name: 'Sydney Wind Farm', regionId: 'r-003', type: 'Wind Farm', address: 'NSW, AU' }
]

function buildAssets() {
  const types = [{ type: 'Forklift', n: 6 }, { type: 'Vehicle', n: 4 }, { type: 'Press', n: 3 }, { type: 'Fire Extinguisher', n: 5 }, { type: 'Crane', n: 2 }, { type: 'Generator', n: 2 }, { type: 'Compressor', n: 2 }, { type: 'Conveyor', n: 1 }]
  let i = 1; const out = []
  for (const { type, n } of types) {
    for (let k = 0; k < n; k++) {
      out.push({
        id: 'as-' + i.toString().padStart(3, '0'),
        name: type + ' ' + (k + 1).toString().padStart(2, '0'),
        type, siteId: sites[(i + k) % sites.length].id,
        serial: 'SN-' + (1000 + i),
        status: i % 11 === 0 ? 'out_of_service' : 'in_service'
      })
      i++
    }
  }
  return out
}

const assets = buildAssets()

const scoringConfig = {
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

function buildInspections() {
  const list = []
  const statuses = ['in_progress', 'completed', 'completed', 'completed', 'pending_approval', 'critical_failure', 'completed']
  for (let i = 0; i < 40; i++) {
    const site = sites[i % sites.length]; const inspector = users[3 + (i % 9)]; const status = statuses[i % 7]
    list.push({
      id: 'ins-' + (i + 1).toString().padStart(3, '0'),
      templateId: 'pb-' + ((i % 30) + 1).toString().padStart(3, '0'),
      templateTitle: 'Pre-built template ' + ((i % 30) + 1),
      siteId: site.id, siteName: site.name, assignedTo: inspector.id, assignedToName: inspector.name,
      status, progress: status === 'in_progress' ? 60 : 100,
      score: status === 'in_progress' ? null : (status === 'critical_failure' ? 38 : 65 + (i * 7) % 30),
      criticalFailures: status === 'critical_failure' ? 1 + (i % 3) : 0,
      flaggedCount: 1 + (i % 5),
      startedAt: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
      completedAt: status === 'in_progress' ? null : new Date(Date.now() - i * 86400000).toISOString(),
      dueDate: new Date(Date.now() + ((i % 7) - 2) * 86400000).toISOString(),
      responses: {}
    })
  }
  return list
}

function buildActions() {
  const list = []
  const titles = ['Replace damaged guard on press','Recharge fire extinguisher','Reinstate edge protection','Retrain forklift operator','Repair seatbelt buckle','Update LOTO procedure','Refill spill kit','Inspect harness lot 4423','Replace missing scaffold tag','Service emergency eyewash']
  const priorities = ['low','medium','high','critical']
  const statuses = ['open','in_progress','blocked','completed','verified']
  for (let i = 0; i < 80; i++) {
    const owner = users[3 + (i % 9)]; const site = sites[i % sites.length]
    list.push({
      id: 'act-' + (i + 1).toString().padStart(3, '0'),
      title: titles[i % titles.length],
      description: 'Generated from inspection findings',
      priority: priorities[i % 4], status: statuses[i % 5],
      ownerId: owner.id, ownerName: owner.name, siteId: site.id, siteName: site.name,
      sourceInspectionId: 'ins-' + ((i % 40) + 1).toString().padStart(3, '0'),
      dueDate: new Date(Date.now() + (((i * 3) % 30) - 12) * 86400000).toISOString(),
      createdAt: new Date(Date.now() - (i % 30) * 86400000).toISOString()
    })
  }
  return list
}

function buildFindings() {
  const list = []
  const types = ['observation','unsafe_act','unsafe_condition','near_miss','critical_control_failure']
  const sevs = ['low','medium','high','critical']
  for (let i = 0; i < 60; i++) {
    const site = sites[i % sites.length]
    list.push({
      id: 'fnd-' + (i + 1).toString().padStart(3, '0'),
      title: 'Finding ' + (i + 1),
      description: 'Captured during inspection',
      type: types[i % types.length],
      severity: sevs[i % 4],
      sifPotential: i % 7 === 0,
      hazardCategory: hazardCategories[i % hazardCategories.length].id,
      siteId: site.id, siteName: site.name,
      sourceInspectionId: 'ins-' + ((i % 40) + 1).toString().padStart(3, '0'),
      reportedAt: new Date(Date.now() - (i % 40) * 86400000).toISOString(),
      status: ['open','in_review','closed'][i % 3]
    })
  }
  return list
}

export function buildSeed() {
  return {
    users, roles, sites,
    regions: [{ id: 'r-001', name: 'North America' }, { id: 'r-002', name: 'EMEA' }, { id: 'r-003', name: 'Asia Pacific' }],
    assets,
    templates: [], // server starts empty, frontend has full library
    inspections: buildInspections(),
    actions: buildActions(),
    findings: buildFindings(),
    scoringConfig,
    hazardCategories
  }
}
