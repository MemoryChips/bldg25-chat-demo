import { Response, NextFunction } from 'express'

export function checkIfAuthorized(allowedRoles: string[]) {
  return (_req: any, res: Response, next: NextFunction) => {
    const userRoles: string[] = res.locals.user.roles
    const notAuthorized = userRoles.every(role => {
      return allowedRoles.indexOf(role) === -1
    })
    if (notAuthorized) {
      res.sendStatus(403)
    } else {
      next()
    }
  }
}
