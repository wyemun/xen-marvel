import { Request, Response } from 'express'
import Marvel from '../providers/Marvel'

interface GetCharacterByIdParam {
  characterId: string
}

export default class ApiController {
  public static async getCharacterById(req: Request<GetCharacterByIdParam>, res: Response): Promise<any> {
    const characterId = req.params.characterId

    const mRes = await Marvel.getCharacterById(characterId)
    const mJson = await mRes.json()
    
    if (mRes.status < 200 || mRes.status >= 300) {
      console.log('Marvel API failed: %s', mRes.status)
      console.log('Response: ', mJson)
      throw new Error('Failed to get request')
    }

    return res.json(mJson) // TODO clean it up?
  }

  public static async getAllCharacters(req: Request, res:Response): Promise<any> {
    const characterId = req.params.characterId

    const mRes = await Marvel.getAllCharacters()
    const mJson = await mRes.json()
    
    if (mRes.status < 200 || mRes.status >= 300) {
      console.log('Marvel API failed: %s', mRes.status)
      console.log('Response: ', mJson)
      throw new Error('Failed to get request')
    }

    return res.json(mJson) // TODO clean it up?
  }
}