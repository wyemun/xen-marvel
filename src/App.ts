import ApiService from './services/api.service'

export default class App {

  public static init(): Promise<any> {
    const service = new ApiService({ port: 8080 })
    return service.start()
  }

}