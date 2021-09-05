export interface ILocalConfig {
  serviceType: 'api' // no other choice for now
  servicePort: number
  clusterMode: boolean
  marvelApiHost: string
  marvelApiKey: string
  marvelPrivateKey: string
  apiCacheTime: string
}

export default class Locals {
  public static config(): ILocalConfig {
    return {
      serviceType: 'api', // Hardcoded for now, can be retrieved from env if multiple services are defined
      servicePort: parseInt(process.env.PORT || '8080', 10),
      clusterMode: process.env.CLUSTER_MODE === '1' || false,
      marvelApiHost: process.env.MARVEL_API_HOST || 'https://gateway.marvel.com',
      marvelApiKey: process.env.MARVEL_API_PUBKEY || '',
      marvelPrivateKey: process.env.MARVEL_API_PRIVATEKEY || '',
      apiCacheTime: process.env.API_CACHE_TIME || '1 day'
    }
  }
}