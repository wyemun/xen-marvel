import { Router } from 'express'
import apicache from 'apicache'
import ApiController from '../controllers/api.controller'
import Locals from '../providers/Locals'

const router = Router()

const cache = apicache.middleware
const cacheTime = Locals.config().apiCacheTime

router.get('/:characterId', cache(cacheTime), ApiController.getCharacterById)
router.get('/', cache(cacheTime), ApiController.getAllCharacters)
// router.get('/', ApiController.getAllCharacters) // Enable this to disable caching by apicache

export default router