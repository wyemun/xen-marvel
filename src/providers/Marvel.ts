import fetch, { RequestInit, Response } from 'node-fetch'
import crypto from 'crypto'
import Locals from './Locals'

const buildRequestOptions = (): Partial<RequestInit> => {
  return {
    method: 'get',
  }
}

export const buildFetchUrl = (path: string): string => {
  console.log('Preparing fetch request to Marvel API...')
  const ts = Date.now()
  const hash = crypto.createHash('md5').update(`${ts}${Locals.config().marvelPrivateKey}${Locals.config().marvelApiKey}`).digest('hex')

  const builtInParams = [
    `ts=${ts}`,
    `apikey=${Locals.config().marvelApiKey}`,
    `hash=${hash}`
  ]
  return `${Locals.config().marvelApiHost}${path}?${builtInParams.join('&')}`
}

const getAllCharacters = (): Promise<Response> => {
  return fetch(
    buildFetchUrl('/v1/public/characters'), {
    ...buildRequestOptions()
  })
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