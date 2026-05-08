import express from 'express'
import cors from 'cors'
import { authMiddleware } from './middleware/auth.js'
import { loadDb } from './data/store.js'
import authRoutes from './routes/auth.js'
import templateRoutes from './routes/templates.js'
import prebuiltRoutes from './routes/prebuilt.js'
import inspectionRoutes from './routes/inspections.js'
import actionRoutes from './routes/actions.js'
import findingRoutes from './routes/findings.js'
import assetRoutes from './routes/assets.js'
import siteRoutes from './routes/sites.js'
import roleRoutes from './routes/roles.js'
import userRoutes from './routes/users.js'
import generatorRoutes from './routes/generator.js'
import scoringRoutes from './routes/scoring.js'
import analyticsRoutes from './routes/analytics.js'
import reportRoutes from './routes/reports.js'

const app = express()
app.use(cors())
app.use(express.json({ limit: '4mb' }))

await loadDb()

app.use(authMiddleware)

app.get('/api/health', (req, res) => res.json({ ok: true, name: 'CheckWise EHS API' }))
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/roles', roleRoutes)
app.use('/api/templates', templateRoutes)
app.use('/api/prebuilt-checklists', prebuiltRoutes)
app.use('/api/inspections', inspectionRoutes)
app.use('/api/actions', actionRoutes)
app.use('/api/findings', findingRoutes)
app.use('/api/assets', assetRoutes)
app.use('/api/sites', siteRoutes)
app.use('/api/generator', generatorRoutes)
app.use('/api/scoring', scoringRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/reports', reportRoutes)

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: err.message })
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log('[checkwise-server] listening on http://localhost:' + port)
})
