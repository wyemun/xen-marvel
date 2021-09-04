import fetch, { RequestInit, Response } from 'node-fetch'
import crypto from 'crypto'
import Locals from './Locals'

type QueryPaginationOptions = {
  limit: number
  offset: number
}

export interface MarvelRespCharacter {
  id: number,
  name: string,
  description: string,
  modified: string
}

export interface MarvelResp {
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

export interface MarvelErrorResp {
  etag?: string,
  code: number
  status: string
}

const buildRequestOptions = (lastEtag?: string): Partial<RequestInit> => {
  return {
    method: 'get',
    headers: {
      'Accept-Encoding': 'gzip',
      ...(lastEtag? {'If-None-Match': lastEtag} : {})
    }
  }
}

export const buildFetchUrl = (path: string, query?: Partial<QueryPaginationOptions>): string => {
  console.log('Preparing fetch request to Marvel API...: %s', path, Date.now())
  const ts = Date.now()
  const hash = crypto.createHash('md5').update(`${ts}${Locals.config().marvelPrivateKey}${Locals.config().marvelApiKey}`).digest('hex')

  const builtInParams = [
    `ts=${ts}`,
    `apikey=${Locals.config().marvelApiKey}`,
    `hash=${hash}`
  ]

  if (query) {
    Object.entries(query).forEach(
      ([k, v]) => builtInParams.push(`${k}=${v}`)
    )
  }

  return `${Locals.config().marvelApiHost}${path}?${builtInParams.join('&')}`
}

const getAllCharactersRestricted = (offset: number, lastEtag?: string): Promise<Response> => {
  console.log('Marvel api searching with offset: ', offset)
  return fetch(
    buildFetchUrl('/v1/public/characters', {limit: 100, offset}), {
    ...buildRequestOptions(lastEtag)
  })
}

type EtagCharacters = {
  etag: string
  ids: number[]
}

class NaiveCharacterCache {
  private offsetToEtag: Map<number, EtagCharacters>
  private static instance: NaiveCharacterCache

  constructor() {
    this.offsetToEtag = new Map()
  }

  add(offset: number, etag: string, characterIds: number[]): void {
    const item = this.offsetToEtag.get(offset)
    if (item && item.etag === etag) {
        return
    }

    this.offsetToEtag.set(offset, {etag, ids: characterIds})
  }

  clear(): void {
    this.offsetToEtag.clear()
  }

  getCharacters(): number[] {
    const results: number[] = []

    this.offsetToEtag.forEach((value, key) => {
      const characterIds = value.ids
      if (characterIds) {
        characterIds.forEach((characterId, cIndex) => {
          results[key + cIndex] = characterId
        })
      }
    })

    return results
  }

  getEtagByOffset(offset: number): string | undefined {
    const item = this.offsetToEtag.get(offset)
    return item ? item.etag : undefined
  }

  getCharactersByOffset(offset: number): number[] | undefined {
    const item = this.offsetToEtag.get(offset)
    return item ? item.ids : undefined
  }

  public static getInstance(): NaiveCharacterCache {
    if (!NaiveCharacterCache.instance) {
      NaiveCharacterCache.instance = new NaiveCharacterCache()
    }

    return NaiveCharacterCache.instance
  }
}

const getAllCharacters = async (): Promise<number[]> => {
  let gotAll = false
  let offset = 0
  const perPage = 100
  let total = 5000

  let results: number[] = []

  while(!gotAll) {
    
    const mResp = await getAllCharactersRestricted(
      offset,
      offset > 0 ? NaiveCharacterCache.getInstance().getEtagByOffset(offset) : undefined) //skip first page

    if (mResp.status === 304) {
      // data no change, no payload too
      console.log('304 response from server, use cache')

      const cachedCharacters = NaiveCharacterCache.getInstance().getCharactersByOffset(offset)
      if (!cachedCharacters) {
        throw new Error('Caching error.')
      }

      results = results.concat(
        cachedCharacters
      )

    } else if (mResp.status >= 400) {
      const mJson: MarvelErrorResp = await mResp.json()
      throw new Error(mJson.status)
    } else {
      const mJson: MarvelResp = await mResp.json()
      const characterIds = mJson.data.results.map(({id}) => id)
      NaiveCharacterCache.getInstance().add(offset, (<MarvelResp>mJson).etag, characterIds)
      results = results.concat(characterIds)

      if (offset === 0) {
        total = mJson.data.total // the first request will always return full result
      }

      gotAll = total <= (offset + perPage)
    }
    
    offset += perPage
  }

  // console.log('From naive cache', NaiveCharacterCache.getInstance().getCharacters())

  return results
}

const getCharacterById = (characterId: string): Promise<Response> => {
  return fetch(
    buildFetchUrl(`/v1/public/characters/${characterId}`), {
    ...buildRequestOptions()
  })
}

export default {
  getAllCharacters,
  getCharacterById
}