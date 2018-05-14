export interface DbUser {
  // id?: string
  email: string
  userName: string
  passwordDigest: string
  roles: string[]
  avatarUrl?: string
}

export interface User extends DbUser {
  id: string
}
