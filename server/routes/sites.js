import { Router } from 'express'
import { db } from '../data/store.js'
const r = Router()
r.get('/', (req, res) => res.json(db.sites))
export default r
