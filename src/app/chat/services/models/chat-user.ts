export interface ChatUser {
  id: string
  name: string
  isAdmin: boolean
  // isLoggedIn: boolean
}

export const initMe: ChatUser = {
  id: '',
  name: '',
  isAdmin: false,
  // isLoggedIn: false
}
