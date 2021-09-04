import { Request, Response, NextFunction } from 'express'
import ResponseError from './ResponseError'

export default class Handler {
  public static notFound(req: Request, res: Response): void {
    res.status(404).json({
      code: 404,
      status: 'Page not found'
    })
  }

  /**
   * Middleware for general internal error
   */
  public static internalError(err: Error, req: Request, res: Response, next: NextFunction): void {
    if (err instanceof ResponseError) {
      res.status(err.getStatusCode()).json({
        code: err.getStatusCode(),
        status: err.message || err.getDefaultMessage()
      })
      return
    }

    res.status(500).json({
      code: 500,
      status: 'Internal error'
    })
  }

  public static logError(err: Error, req: Request, res: Response, next: NextFunction): void {
    if (!(err instanceof ResponseError)) {
      console.log(err.stack) // * Replace with a proper logger like Winston
    }
    return next(err)
  }

}