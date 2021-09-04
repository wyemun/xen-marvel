import { Router } from 'express'
import ApiController from '../controllers/api.controller'

const router = Router()

router.get('/:characterId', ApiController.getCharacterById)
router.get('/', ApiController.getAllCharacters)

export default router