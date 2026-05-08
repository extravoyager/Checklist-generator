import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/login', name: 'login', component: () => import('../views/Login.vue'), meta: { public: true } },
  { path: '/', name: 'dashboard', component: () => import('../views/Dashboard.vue') },
  { path: '/generator', name: 'generator', component: () => import('../views/Generator.vue'), meta: { perm: 'template.create' } },
  { path: '/templates', name: 'templates', component: () => import('../views/TemplateLibrary.vue'), meta: { perm: 'template.view' } },
  { path: '/templates/:id/edit', name: 'template-edit', component: () => import('../views/TemplateBuilder.vue'), meta: { perm: 'template.edit' } },
  { path: '/prebuilt', name: 'prebuilt', component: () => import('../views/PrebuiltLibrary.vue'), meta: { perm: 'template.view' } },
  { path: '/inspections', name: 'inspections', component: () => import('../views/Inspections.vue'), meta: { perm: 'inspection.view' } },
  { path: '/inspections/:id/run', name: 'inspection-run', component: () => import('../views/InspectionRunner.vue'), meta: { perm: 'inspection.run' } },
  { path: '/actions', name: 'actions', component: () => import('../views/Actions.vue'), meta: { perm: 'action.view' } },
  { path: '/findings', name: 'findings', component: () => import('../views/Findings.vue'), meta: { perm: 'finding.view' } },
  { path: '/assets', name: 'assets', component: () => import('../views/Assets.vue'), meta: { perm: 'asset.view' } },
  { path: '/assets/:id', name: 'asset-detail', component: () => import('../views/AssetDetail.vue'), meta: { perm: 'asset.view' } },
  { path: '/reports/:inspectionId', name: 'report', component: () => import('../views/Report.vue') },
  { path: '/analytics', name: 'analytics', component: () => import('../views/Analytics.vue'), meta: { perm: 'analytics.view' } },
  { path: '/admin', name: 'admin', component: () => import('../views/Admin.vue'), meta: { perm: 'admin.view' } },
  { path: '/admin/roles', name: 'admin-roles', component: () => import('../views/Roles.vue'), meta: { perm: 'admin.manage_roles' } },
  { path: '/admin/scoring', name: 'admin-scoring', component: () => import('../views/Scoring.vue'), meta: { perm: 'admin.scoring' } }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.public) return true
  if (!auth.user) return { name: 'login' }
  if (to.meta.perm && !auth.can(to.meta.perm)) return { name: 'dashboard' }
  return true
})

export default router
