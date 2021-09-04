import { Request, Response } from 'express'
import Marvel from '../providers/Marvel'

interface GetCharacterByIdParam {
  characterId: string
}

interface MarvelRespCharacter {
  id: number,
  name: string,
  description: string,
  modified: string
}

interface MarvelResp {
  code: number,
  etag: string,
  data: {
    offset: number
    limit: number
    total: number
    count: number
    results: MarvelRespCharacter[]
  }
}

interface MarvelErrorResp {
  code: number
  status: string
}

export default class ApiController {
  public static async getCharacterById(req: Request<GetCharacterByIdParam>, res: Response): Promise<any> {
    const characterId = req.params.characterId

    const mRes = await Marvel.getCharacterById(characterId)
    const mJson: MarvelResp | MarvelErrorResp = await mRes.json()
    
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
    const mRes = await Marvel.getAllCharacters()
    const mJson: MarvelResp | MarvelErrorResp = await mRes.json()
    
    if (mRes.status < 200 || mRes.status >= 300) { // TODO handle ETAG cache 304
      console.log('Marvel API failed: %s', mRes.status)
      console.log('Response: ', mJson)
      return res.status(404).json(<MarvelErrorResp>mJson)
    }

    const characterIds = (<MarvelResp>mJson).data.results.map(({id}) => id)
    return res.json(characterIds)
  }
}