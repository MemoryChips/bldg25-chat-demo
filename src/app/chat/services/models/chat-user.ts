export interface ChatUser {
  // email: string,
  id: string
  roles: string[]
  userName: string
  isAdmin: boolean
  loginTime: number
}

export interface ChatUsers {
  [id: string]: ChatUser
}

export const initMe: ChatUser = {
  // email: '',
  id: '',
  roles: [],
  userName: '',
  isAdmin: false,
  loginTime: 0
}
