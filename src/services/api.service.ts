import http from 'http'
import express, { Request, Response, Express, NextFunction } from 'express'
import Service from './Service'
import ApiRoutes from '../routes/api.route'
import CacheRoutes from '../routes/cache.route'
import ExceptionHandler from '../exceptions/Handler'
import swaggerLoader from '../loaders/swagger.loader'

export interface ApiServiceConfig {
  port?: number
}

export default class ApiService extends Service<http.Server> {
  private expressApp: Express
  private httpServer?: http.Server
  private port: number

  constructor(config: ApiServiceConfig) {
    super('api-service')
    this.port = config.port || 8080
    this.expressApp = express()

    this.mountMiddlewares()
    this.mountRoutes()
    this.mountExceptionHandlers()
  }

  public getExpressApp () {
    return this.expressApp
  }

  /**
   * Define the expressJS middlewares
   */
  private mountMiddlewares(): void {
    this.expressApp.use(express.json())
    this.expressApp.use(express.urlencoded({
      extended: true
    }))
  }

  /**
   * Define all the routes entries here
   */
  private mountRoutes(): void {
    this.expressApp.use('/characters', ApiRoutes)
    this.expressApp.use('/cache', CacheRoutes)

    swaggerLoader(this.expressApp)

    this.expressApp.get('/', async (req, res) => {
      res.json({ message: 'hello world' })
    })
  }

  /**
   * Define the exeption handlers for express
   */
  private mountExceptionHandlers(): void {
    this.expressApp.use(ExceptionHandler.logError) // always log error first
    this.expressApp.use(ExceptionHandler.internalError)
    this.expressApp.use('*', ExceptionHandler.notFound)
  }

  /**
   * Start http server
   */
  public async start(): Promise<http.Server> {
    this.httpServer = http.createServer(this.expressApp)
    return this.httpServer.listen(this.port)
  }
}