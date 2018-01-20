import {Request, Response, NextFunction} from 'express'

export function checkIfAuthorized(allowedRoles: string[]) {

  return (req: Request, res: Response, next: NextFunction) => {
    const userRoles: string[] = req['user'].roles
    const notAuthorized = userRoles.every((role) => {
      return !allowedRoles.includes(role)
    })
    if (notAuthorized) {
      res.sendStatus(403)
    } else {
      next()
    }
  }

}
