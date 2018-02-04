export interface DbUser {
  // id: number
  email: string
  userName: string
  passwordDigest: string,
  roles: string[]
}

export interface User extends DbUser {
  id: string
}
