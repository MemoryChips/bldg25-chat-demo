import { Request, Response, NextFunction } from 'express'

export function checkIfAuthenticated(req: Request, res: Response, next: NextFunction) {

  if (req['user']) {
    next()
  } else {
    res.status(403).send({})
  }

}
