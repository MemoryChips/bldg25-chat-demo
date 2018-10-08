import { getUserFromJwt } from '../security'
import { Request, Response, NextFunction } from 'express'

export function getUserFromRequest(req: Request, res: Response, next: NextFunction) {
  const jwt = req.cookies['SESSIONID']
  if (jwt) {
    getUserFromJwt(jwt)
      .then(user => {
        if (user) res.locals.user = user
        next()
      })
      .catch(_err => {
        console.log(`Did not find user in request. Continuing anyway for now...`)
        next()
      })
  } else {
    next()
  }
}
