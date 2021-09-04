import { Router } from 'express'
import apicache from 'apicache'

const router = Router()

router.get('/index', (req, res) => {
  res.json(apicache.getIndex())
})

router.get('/performance', (req, res) => {
  res.json(apicache.getPerformance())
})

export default router