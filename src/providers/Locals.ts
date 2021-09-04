export interface ILocalConfig {
  serviceType: 'api' // no other choice for now
  clusterMode: boolean
  marvelApiHost: string
  marvelApiKey: string
  marvelPrivateKey: string
}

export default class Locals {
  public static config(): ILocalConfig {
    return {
      serviceType: 'api', // Hardcoded for now, can be retrieved from env if multiple services are defined
      clusterMode: process.env.CLUSTER_MODE === '1' || false,
      marvelApiHost: process.env.MARVEL_API_HOST || 'https://gateway.marvel.com',
      marvelApiKey: process.env.MARVEL_API_PUBKEY || '',
      marvelPrivateKey: process.env.MARVEL_API_PRIVATEKEY || ''
    }
  }
}