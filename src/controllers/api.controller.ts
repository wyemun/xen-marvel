import { NextFunction, Request, Response } from 'express'
import Marvel from '../providers/Marvel'

interface GetCharacterByIdParam {
  characterId: string
}

export default class ApiController {
  public static async getCharacterById(req: Request<GetCharacterByIdParam>, res: Response, next: NextFunction): Promise<any> {
    const characterId = req.params.characterId
    try {
      const character = await Marvel.getCharacterById(characterId)
      return res.json({
        Id: character.id,
        Name: character.name,
        Description: character.description
      })
    } catch (e: any) {
      next(e)
    }
  }

  public static async getAllCharacters(req: Request, res:Response, next: NextFunction): Promise<any> {
    try {
      const results = await Marvel.getAllCharacters()
      return res.json(results)
    } catch (e: any) {
      next(e)
    }
  }
}