export default abstract class ResponseError extends Error {
  protected abstract statusCode: number
  protected abstract defaultMessage: string

  public getStatusCode(): number {
    return this.statusCode
  }

  public getDefaultMessage(): string {
    return this.defaultMessage
  }
}

export class GenericResponseError extends ResponseError {
  protected statusCode: number
  protected defaultMessage: string

  constructor(statusCode: number, message: string) {
    super()
    this.statusCode = statusCode
    this.defaultMessage = message
  }
}

export class BadRequestError extends ResponseError {
  protected statusCode = 400
  protected defaultMessage = 'Bad request'
}

export class NotFoundError extends ResponseError {
  protected statusCode = 404
  protected defaultMessage = 'U shall not find.'
}

export class UnauthorizedError extends ResponseError {
  protected statusCode = 401
  protected defaultMessage = 'Uh oh, you are not authorized.'
}

export class ForbiddenError extends ResponseError {
  protected statusCode = 403
  protected defaultMessage = 'Nope, you cannot access this'
}