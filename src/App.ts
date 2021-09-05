import Locals from './providers/Locals'
import ApiService from './services/api.service'

export default class App {

  public static init(): Promise<any> {
    const service = new ApiService({ port: Locals.config().servicePort })
    return service.start()
  }

}