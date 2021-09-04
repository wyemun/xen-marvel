import http from 'http'
import express, { Request, Response, Express, NextFunction } from 'express'
import Service from './Service'
import ApiRoutes from '../routes/api.route'

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

    this.expressApp.use('/', async (req, res) => {
      res.json({ message: 'hello world' })
    })
  }

  /**
   * Define the exeption handlers for express
   */
  private mountExceptionHandlers(): void {
    // * Can add logger here

    this.expressApp.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      res.status(500).json({
        error: 'Internal error'
      })
    })

    this.expressApp.use('*', (req: Request, res: Response) => {
      res.status(404).json({
        error: 'Page not found'
      })
    })
  }

  /**
   * Start http server
   */
  public async start(): Promise<http.Server> {
    this.httpServer = http.createServer(this.expressApp)
    return this.httpServer.listen(this.port)
  }
}