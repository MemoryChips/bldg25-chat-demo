
import { db } from './database'
import { createSessionToken } from './security.utils'

export function loginAsUser(req, res) {

  const userEmail = req.body.email

  const user = db.findUserByEmail(userEmail)

  createSessionToken(user)
    .then(sessionToken => {
      res.cookie('SESSIONID', sessionToken,
        { httpOnly: true, secure: true })
      res.status(200).json(user)
    })
    .catch(err => {
      console.log('Error trying to login as user', err)
      res.sendStatus(500)
    })
}
