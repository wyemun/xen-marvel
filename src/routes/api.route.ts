import { Router } from 'express'
import apicache from 'apicache'
import ApiController from '../controllers/api.controller'

const router = Router()

const cache = apicache.middleware

router.get('/:characterId', cache('5 minutes'), ApiController.getCharacterById) // ! temp cache strategy
router.get('/', cache('5 minutes'), ApiController.getAllCharacters) // ! temp cache strategy

export default router