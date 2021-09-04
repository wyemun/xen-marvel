import { Request, Response } from 'express'
import Marvel from '../providers/Marvel'

interface GetCharacterByIdParam {
  characterId: string
}

export default class ApiController {
  public static async getCharacterById(req: Request<GetCharacterByIdParam>, res: Response): Promise<any> {
    const characterId = req.params.characterId

    try {
      const character = await Marvel.getCharacterById(characterId)
      return res.json({
        Id: character.id,
        Name: character.name,
        Description: character.description
      })
    } catch (e: any) {
      return res.status(500).json({
        code: 500,
        status: e.message || 'Unknown error'
      })
    }
  }

  public static async getAllCharacters(req: Request, res:Response): Promise<any> {
    try {
      const results = await Marvel.getAllCharacters()
      return res.json(results)
    } catch (e: any) {
      console.log('Failed to get all characters', e)
      return res.status(500).json({
        code: 500,
        status: e.message || 'Unknown error'
      })
    }
  }
}