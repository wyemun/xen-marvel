import fetch, { RequestInit, Response } from 'node-fetch'
import crypto from 'crypto'
import Locals from './Locals'
import e from 'express'
import { GenericResponseError } from '../exceptions/ResponseError'
import NaiveCharacterCache from './NaiveCharacterCache'

type QueryPaginationOptions = {
  limit: number
  offset: number
}

export interface MarvelRespCharacter {
  id: number
  name: string
  description: string
  modified: string
}

export interface MarvelResp {
  code: number
  etag: string
  data: {
    offset: number
    limit: number
    total: number
    count: number
    results: MarvelRespCharacter[]
  }
}

export interface MarvelErrorResp {
  etag?: string
  code: number
  status: string
}

const buildRequestOptions = (lastEtag?: string): Partial<RequestInit> => {
  return {
    method: 'get',
    headers: {
      'Accept-Encoding': 'gzip',
      ...(lastEtag ? { 'If-None-Match': lastEtag } : {}),
    },
  }
}

export const buildFetchUrl = (path: string, query?: Partial<QueryPaginationOptions>): string => {
  console.log('Preparing fetch request to Marvel API...: %s', path, Date.now())
  const ts = Date.now()
  const hash = crypto.createHash('md5').update(`${ts}${Locals.config().marvelPrivateKey}${Locals.config().marvelApiKey}`).digest('hex')

  const builtInParams = [`ts=${ts}`, `apikey=${Locals.config().marvelApiKey}`, `hash=${hash}`]

  if (query) {
    Object.entries(query).forEach(([k, v]) => builtInParams.push(`${k}=${v}`))
  }

  return `${Locals.config().marvelApiHost}${path}?${builtInParams.join('&')}`
}

const getAllCharactersRestricted = (offset: number, lastEtag?: string): Promise<Response> => {
  console.log('Marvel api searching with offset: ', offset)
  return fetch(buildFetchUrl('/v1/public/characters', { limit: 100, offset }), {
    ...buildRequestOptions(lastEtag),
  })
}

const getAllCharacters = async (): Promise<number[]> => {
  let offset = 0
  const perPage = 100

  let results: number[] = []

  // call first page first
  const mRespFirst = await getAllCharactersRestricted(offset)
  if (mRespFirst.status >= 400) {
    const mJson: MarvelErrorResp = await mRespFirst.json()
    throw new GenericResponseError(mRespFirst.status, mJson.status || 'Unknown error')
  } else {
    const mJson: MarvelResp = await mRespFirst.json()
    const characterIds = mJson.data.results.map(({ id }) => id)
    NaiveCharacterCache.getInstance().add(offset, (<MarvelResp>mJson).etag, characterIds)
    results = characterIds

    const total = mJson.data.total
    offset += perPage

    const promises: Promise<number[]>[] = []

    while (total > offset + perPage) {
      promises.push(
        getAllCharactersRestricted(offset, NaiveCharacterCache.getInstance().getEtagByOffset(offset)).then((mResp) => {
          if (mResp.status === 304) {
            // data no change, no payload too
            console.log('304 response from server, use cache')

            const cachedCharacters = NaiveCharacterCache.getInstance().getCharactersByOffset(offset)
            if (!cachedCharacters) {
              throw new Error('Caching error.')
            }

            return cachedCharacters
          } else if (mResp.status >= 400) {
            return mResp.json().then((mJson: MarvelErrorResp) => {
              throw new GenericResponseError(mResp.status, mJson.status || 'Unknown error')
            })
          } else {
            return mResp.json().then((mJson: MarvelResp) => {
              const characterIds = mJson.data.results.map(({ id }) => id)
              NaiveCharacterCache.getInstance().add(offset, (<MarvelResp>mJson).etag, characterIds)

              return characterIds
            })
          }
        })
      )
      offset += perPage
    }

    const resultsFromPromise = await Promise.all(promises)

    return results.concat(...resultsFromPromise)
  }
}

const getCharacterById = async (characterId: string): Promise<MarvelRespCharacter> => {
  const mResp = await fetch(buildFetchUrl(`/v1/public/characters/${characterId}`), {
    ...buildRequestOptions(),
  })

  if (mResp.status < 200 || mResp.status >= 300) {
    const mJson: MarvelErrorResp = await mResp.json()
    throw new GenericResponseError(mJson.code, mJson.status)
  } else {
    const mJson: MarvelResp = await mResp.json()
    return mJson.data.results[0]
  }
}

export default {
  getAllCharacters,
  getCharacterById,
}
