import request from 'supertest'
import ApiService from '../src/services/api.service'
import createApiService from './utils/create-service'

describe('API Service', () => {
  let service: ApiService

  beforeAll(async () => {
    service = await createApiService()
  })

  it('should return status 200', async () => {
    const res = await request(service.getExpressApp())
      .get('/')

    expect(res.statusCode).toEqual(200)
    expect(res.body.message).toEqual('hello world')
  })
})