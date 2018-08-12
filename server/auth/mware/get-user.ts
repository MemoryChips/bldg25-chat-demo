import { getUserFromJwt } from '../security'
import { Response, NextFunction } from 'express'

export function getUserFromRequest(
  req: any,
  _res: Response,
  next: NextFunction
) {
  const jwt = req.cookies['SESSIONID']
  if (jwt) {
    getUserFromJwt(jwt)
      .then(user => {
        if (user) req.user = user
        next()
      })
      .catch(_err => {
        console.log(
          `Did not find user in request. Continuing anyway for now...`
        )
        next()
      })
  } else {
    next()
  }
}
