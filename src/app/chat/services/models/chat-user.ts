export interface ChatUser {
  id: string
  name: string
  isAdmin: boolean
  roles: string[]
}

export interface ChatUsers {
  [id: string]: ChatUser
}

export const initMe: ChatUser = {
  id: '',
  name: '',
  isAdmin: false,
  roles: []
}
