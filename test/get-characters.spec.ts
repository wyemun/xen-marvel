import request from 'supertest'
import Chance from 'chance'
import nock from 'nock'
import apicache from 'apicache'
import Locals from '../src/providers/Locals'
import ApiService from '../src/services/api.service'
import createService from './utils/create-service'

const uri = '/characters'

const chance = new Chance()

describe('[API] Get Characters', () => {
  let service: ApiService

  beforeAll(async () => {
    apicache.options({
      enabled: false
    })
    service = await createService()
  })

  afterEach(() => {
    nock.cleanAll()
  })

  it('should return a list of characters', async () => {
    const totalCharacters = 20
    const mockedResponse = {
      code: 200,
      etag: chance.hash(),
      data: {
        offset: 0,
        limit: 100,
        total: totalCharacters,
        count: totalCharacters,
        results: [...Array(totalCharacters)].map((_, i) => ({
          id: chance.integer({min: 100000, max: 199999}),
          name: chance.name,
          description: chance.sentence(),
          modified: chance.date()
          }))
      }}

    nock(Locals.config().marvelApiHost)
      .get(/\/v1\/public\/characters.*$/)
      .once()
      .reply(200, mockedResponse)
  
    const res = await request(service.getExpressApp())
      .get(uri)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveLength(totalCharacters)
  })

  it('should forward Marvel api error response', async () => {
    const mockedResponse = {
      code: 400,
      status: 'something went bad'
      }

    nock(Locals.config().marvelApiHost)
      .get(/\/v1\/public\/characters.*$/)
      .reply(400, mockedResponse)

    const res = await request(service.getExpressApp())
      .get(uri)

    expect(res.statusCode).toEqual(400)
    expect(res.body.status).toEqual(mockedResponse.status)
  })

})
