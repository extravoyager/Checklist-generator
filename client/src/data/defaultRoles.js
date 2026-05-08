// Default 12 roles with permission keys

export const allPermissions = [
  // template
  'template.view', 'template.create', 'template.edit', 'template.publish', 'template.duplicate', 'template.delete', 'template.archive',
  // inspection
  'inspection.view', 'inspection.create', 'inspection.run', 'inspection.complete', 'inspection.approve', 'inspection.delete',
  // action
  'action.view', 'action.create', 'action.edit', 'action.close', 'action.verify', 'action.delete',
  // finding
  'finding.view', 'finding.create', 'finding.edit', 'finding.delete',
  // analytics
  'analytics.view', 'analytics.export',
  // asset
  'asset.view', 'asset.edit',
  // admin
  'admin.view', 'admin.manage_users', 'admin.manage_sites', 'admin.manage_assets', 'admin.manage_taxonomy', 'admin.manage_roles', 'admin.scoring', 'admin.branding'
]

const all = [...allPermissions]
const viewer = ['template.view', 'inspection.view', 'action.view', 'finding.view', 'analytics.view', 'asset.view']

export const defaultRoles = [
  { id: 'super-admin', name: 'Super Admin', description: 'Full access to all modules and settings', permissions: all, system: true },
  { id: 'ehs-admin', name: 'EHS Admin', description: 'EHS configuration and global standards', permissions: all.filter(p => p !== 'admin.manage_roles'), system: true },
  { id: 'corporate-ehs', name: 'Corporate EHS Manager', description: 'Cross-region oversight and analytics',
    permissions: ['template.view','template.create','template.edit','template.publish','template.duplicate','template.archive',
      'inspection.view','inspection.approve','action.view','action.edit','action.verify',
      'finding.view','finding.edit','analytics.view','analytics.export','asset.view','admin.view','admin.scoring'] },
  { id: 'regional-ehs', name: 'Regional EHS Manager', description: 'Region-level inspection oversight',
    permissions: ['template.view','template.duplicate','inspection.view','inspection.approve','action.view','action.edit','action.verify',
      'finding.view','finding.edit','analytics.view','asset.view'] },
  { id: 'site-ehs', name: 'Site EHS Manager', description: 'Site-level EHS lead',
    permissions: ['template.view','template.create','template.edit','template.duplicate','template.publish',
      'inspection.view','inspection.create','inspection.run','inspection.complete','inspection.approve',
      'action.view','action.create','action.edit','action.close','action.verify',
      'finding.view','finding.create','finding.edit','analytics.view','asset.view'] },
  { id: 'site-manager', name: 'Site Manager', description: 'Site operational lead',
    permissions: ['template.view','inspection.view','inspection.create','inspection.run','inspection.complete',
      'action.view','action.create','action.edit','action.close','finding.view','analytics.view','asset.view'] },
  { id: 'supervisor', name: 'Supervisor', description: 'Front-line supervisor',
    permissions: ['template.view','inspection.view','inspection.create','inspection.run','inspection.complete',
      'action.view','action.create','action.edit','finding.view','asset.view'] },
  { id: 'inspector', name: 'Inspector', description: 'Conducts inspections and captures findings',
    permissions: ['template.view','inspection.view','inspection.create','inspection.run','inspection.complete',
      'action.view','action.create','finding.view','finding.create','asset.view'] },
  { id: 'contractor-inspector', name: 'Contractor Inspector', description: 'External contractor inspections',
    permissions: ['template.view','inspection.view','inspection.run','inspection.complete','action.view','action.create','finding.view','asset.view'] },
  { id: 'template-builder', name: 'Template Builder', description: 'Authors and manages templates',
    permissions: ['template.view','template.create','template.edit','template.publish','template.duplicate','template.archive','inspection.view'] },
  { id: 'action-owner', name: 'Action Owner', description: 'Closes assigned actions',
    permissions: ['action.view','action.edit','action.close','finding.view','inspection.view'] },
  { id: 'viewer', name: 'Viewer', description: 'Read-only across modules', permissions: viewer }
]

export function getRole(id) {
  return defaultRoles.find(r => r.id === id) || defaultRoles[defaultRoles.length - 1]
}
