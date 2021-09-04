import { Request, Response } from 'express'
import Marvel, { MarvelErrorResp, MarvelResp } from '../providers/Marvel'

interface GetCharacterByIdParam {
  characterId: string
}

export default class ApiController {
  public static async getCharacterById(req: Request<GetCharacterByIdParam>, res: Response): Promise<any> {
    const characterId = req.params.characterId

    const mRes = await Marvel.getCharacterById(characterId)
    const mJson: MarvelResp | MarvelErrorResp = await mRes.json()

    console.log(mRes.headers)

    // TODO handle this at provider
    if (mRes.status < 200 || mRes.status >= 300) { // TODO handle ETAG cache 304
      console.log('Marvel API failed: %s', mRes.status)
      console.log('Response: ', mJson)
      return res.status(404).json(<MarvelErrorResp>mJson)
    }

    const character = (<MarvelResp>mJson).data.results[0]

    return res.json({
      Id: character.id,
      Name: character.name,
      Description: character.description
    })
  }

  public static async getAllCharacters(req: Request, res:Response): Promise<any> {
    try {
      const results = await Marvel.getAllCharacters()
      return res.json(results)
    } catch (e: any) {
      console.log('Failed to get all characters', e)
      return res.json({
        code: 500,
        status: e.message || 'Unknown error'
      })
    }
   
    
  }
}