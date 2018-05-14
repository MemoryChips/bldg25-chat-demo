import { Response, NextFunction } from 'express'

export function checkIfAuthenticated(
  req: any,
  res: Response,
  next: NextFunction
) {
  if (req['user']) {
    next()
  } else {
    res.status(403).send({})
  }
}
