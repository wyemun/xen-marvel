import { Request, Response, Router } from 'express'
import apicache from 'apicache'
import ApiController from '../controllers/api.controller'
import Locals from '../providers/Locals'

const router = Router()

const cache = apicache.middleware
const cacheTime = Locals.config().apiCacheTime

const onlyStatus200 = (req: Request, res: Response) => res.statusCode === 200

/**
 * @openapi
 *
 * /characters/{characterId}:
 *  get:
 *    summary: Returns Marvel character by character id
 *    parameters:
 *      - in: path
 *        name: characterId
 *        required: true
 *        description: Marvel character id
 *        schema:
 *          type: integer
 *          example: 1011118
 *    responses:
 *      200:
 *        description: Returns Marvel character
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                Id:
 *                  type: integer
 *                  format: int32
 *                  example: 1011118
 *                Name:
 *                  type: string
 *                  example: "Hulk (Marvel Zombies)"
 *                Description:
 *                  type: string
 *                  example: "Big guy"
 */
router.get('/:characterId', cache(cacheTime, onlyStatus200), ApiController.getCharacterById)

/**
 * @openapi
 *
 * /characters:
 *  get:
 *    summary: Returns all Marvel characters
 *    responses:
 *      200:
 *        description: Returns all Marvel characters
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: integer
 *                format: int32
 *              example: [1011334,1017100,1009144,1010699,1009146,1016823,]
 */
router.get('/', cache(cacheTime, onlyStatus200), ApiController.getAllCharacters)
// router.get('/', ApiController.getAllCharacters) // Enable this to disable caching by apicache

export default router
