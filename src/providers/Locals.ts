export interface ILocalConfig {
  serviceType: 'api' // no other choice for now
  clusterMode: boolean
}

export default class Locals {
  public static config(): ILocalConfig {
    return {
      serviceType: 'api', // Hardcoded for now, can be retrieved from env if multiple services are defined
      clusterMode: process.env.CLUSTER_MODE === '1' || false
    }
  }
}