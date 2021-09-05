import Handler from './Handler'
import { getMockReq, getMockRes } from '@jest-mock/express'
import { ForbiddenError } from '../exceptions/ResponseError'

describe('Handler.ts', () => {
  describe('notFound()', () => {
    it('should return proper message', () => {
      const req = getMockReq()
      const { res, clearMockRes } = getMockRes()

      Handler.notFound(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        code: 404,
        status: 'Page not found',
      })

      clearMockRes()
    })
  })

  describe('internalError()', () => {
    it('should return proper message when generic error thrown', () => {
      const req = getMockReq()
      const { res, clearMockRes, next } = getMockRes()
      const mockError = new Error('Generic error')

      Handler.internalError(mockError, req, res, next)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        code: 500,
        status: 'Internal error',
      })

      clearMockRes()
    })
  })

  it('should return proper message when ResponseError thrown', () => {
    const req = getMockReq()
    const { res, clearMockRes, next } = getMockRes()
    const mockError = new ForbiddenError()

    Handler.internalError(mockError, req, res, next)

    expect(res.status).toHaveBeenCalledWith(mockError.getStatusCode())
    expect(res.json).toHaveBeenCalledWith({
      code: mockError.getStatusCode(),
      status: mockError.getDefaultMessage(),
    })

    clearMockRes()
  })
})
