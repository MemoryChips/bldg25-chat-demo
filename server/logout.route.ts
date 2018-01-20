import {Request, Response} from 'express'

export function logout(_req: Request, res: Response) {
  console.log('Processing logout.')
  res.clearCookie('SESSIONID')
  res.clearCookie('XSRF-TOKEN')
  res.status(200).json({ user: {}})
}
