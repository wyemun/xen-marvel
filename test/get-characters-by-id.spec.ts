import request from 'supertest'
import Chance from 'chance'
import nock from 'nock'
import apicache from 'apicache'
import Locals from '../src/providers/Locals'
import ApiService from '../src/services/api.service'
import createService from './utils/create-service'

const uri = '/characters'

const chance = new Chance()

describe('[API] Get Characters By Id', () => {
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

  it('should return the character', async () => {
    const mockedCharacter = {
      id: chance.integer({min: 100000, max: 199999}),
      name: chance.name(),
      description: chance.sentence(),
      modified: chance.date()
    }

    const mockedResponse = {
      code: 200,
      etag: chance.hash(),
      data: {
        offset: 0,
        limit: 1,
        total: 1,
        count: 1,
        results: [mockedCharacter]
      }}

    nock(Locals.config().marvelApiHost)
      .get(/\/v1\/public\/characters.*$/)
      .once()
      .reply(200, mockedResponse)
  
    const res = await request(service.getExpressApp())
      .get(`${uri}/${mockedCharacter.id}`)

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('Name', mockedCharacter.name)
    expect(res.body).toHaveProperty('Description', mockedCharacter.description)
    expect(res.body).toHaveProperty('Id', mockedCharacter.id)
  })

  it('should return not found when invalid id', async () => {
    const mockedResponse = {
      code: 404,
      status:'Not found'
    }

    nock(Locals.config().marvelApiHost)
      .get(/\/v1\/public\/characters.*$/)
      .once()
      .reply(404, mockedResponse)
  
    const res = await request(service.getExpressApp())
      .get(`${uri}/${chance.integer({min: 1000000, max: 1999999})}`)

    expect(res.statusCode).toEqual(404)
    expect(res.body).toHaveProperty('code', 404)
    expect(res.body).toHaveProperty('status', 'Not found')
  })


})
