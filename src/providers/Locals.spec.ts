import Locals from './Locals'
import Chance from 'chance'

const chance = new Chance()

describe('Locals.ts', () => {

  describe('config()', () => {
    it('should return configs', () => {
      process.env.CLUSTER_MODE = '1'
      process.env.MARVEL_API_HOST = chance.url()
      process.env.MARVEL_API_PUBKEY = chance.string({length: 24})
      process.env.MARVEL_API_PRIVATEKEY = chance.string({length: 24})
      process.env.API_CACHE_TIME = '2 hours'
      
      const config = Locals.config()

      expect(config).toHaveProperty('clusterMode', true)
      expect(config).toHaveProperty('marvelApiHost', process.env.MARVEL_API_HOST)
      expect(config).toHaveProperty('marvelApiKey', process.env.MARVEL_API_PUBKEY)
      expect(config).toHaveProperty('marvelPrivateKey', process.env.MARVEL_API_PRIVATEKEY)
      expect(config).toHaveProperty('apiCacheTime', process.env.API_CACHE_TIME)
    })
  })
})