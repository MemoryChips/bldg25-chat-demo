import { Response, NextFunction } from 'express'

export function checkIfAuthenticated(_req: any, res: Response, next: NextFunction) {
  if (res.locals.user) {
    next()
  } else {
    res.status(403).send({})
  }
}
