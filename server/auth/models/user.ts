// FIXME: align with front end

export interface Credentials {
  userName?: string
  email: string
  password: string
}

export interface SignUpInfo {
  email: string
  password: string
  userName: string
  avatarUrl?: string
}

export interface UserWoId {
  // _id?: string
  email: string
  userName: string
  // passwordDigest: string
  roles: string[]
  avatarUrl: string
}

export interface UserWithPwdDigest extends UserWoId {
  passwordDigest: string
}

export interface User extends UserWoId {
  _id: string
}
