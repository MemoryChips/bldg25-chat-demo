import { decodeJwt } from '../security'
import { Request, Response, NextFunction } from 'express'

interface RequestWithUser extends Request {
  user: string
}

export function retrieveUserIdFromRequest(
  req: any,
  _res: Response,
  next: NextFunction
) {
  const jwt = req.cookies['SESSIONID']
  if (jwt) {
    handleSessionCookie(jwt, req)
      .then(() => next())
      .catch(err => {
        console.error(err)
        next()
      })
  } else {
    next()
  }
}

async function handleSessionCookie(jwt: string, req: RequestWithUser) {
  try {
    // const payload = await decodeJwt(jwt)
    // req['user'] = payload
    if (typeof jwt === 'string') req['user'] = await decodeJwt(jwt)
  } catch (err) {
    console.log('Error: Could not extract user from request:', err.message)
  }
}
