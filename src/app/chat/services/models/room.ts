import { ChatUser } from './chat-user'

export enum ROOM_LAYOUTS { OneToOne, Small, Large }
export enum ROOM_TYPES { Named, Lobby, OneToOne, Private }

export interface Room {
  id: string
  chatUsers: ChatUser[]
  messages: Message[]
  // open: boolean
  created: number
  type: ROOM_TYPES
  description: string
}

export interface Message {
  // id: string
  chatUserId: string
  text: string
  timeStamp: number  // new Date().getTime()
}
