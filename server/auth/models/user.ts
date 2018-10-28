// Align FE/BE
export interface Credentials {
  email: string
  password: string
  userName?: string
}

export interface SignUpInfo {
  email: string
  password: string
  userName: string
  avatarUrl: string
}

export interface UserWoId {
  email: string
  userName: string
  roles: string[]
  avatarUrl: string
}

export interface User extends UserWoId {
  _id: string
}
// end Align FE/BE

// BE use only
// export interface UserWithPwdDigest extends UserWoId {
//   passwordDigest: string
// }
