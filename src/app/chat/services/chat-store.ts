import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Room, } from './models/room'
// import { Room, Message, ROOM_TYPES } from './models/room'
import { ChatUser, ChatUsers, initMe } from './models/chat-user'
import 'rxjs/add/operator/filter'

export interface ChatUserState {
  chatUsers: ChatUsers,
  me: ChatUser
  isLoggedIn: boolean
}

const initChatUserState: ChatUserState = {
  chatUsers: {},
  me: initMe,
  isLoggedIn: false,
}

const initRoomState: RoomState = {
  rooms: {},
  openRoomIds: [],
  showOpenRooms: false
}

interface RoomState {
  rooms: { [roomId: string]: Room }
  openRoomIds: string[]
  showOpenRooms: boolean
}

export class ChatStore {

  private chatUserState: ChatUserState
  chatUserState$ = new BehaviorSubject<ChatUserState>(undefined)
  // me$ = new BehaviorSubject<ChatUser>(undefined)

  private roomState: RoomState
  roomState$ = new BehaviorSubject<RoomState>(undefined)

  // private openRoomIds: string[] = []
  // openRoomIdsSubject$ = new BehaviorSubject<string[]>(undefined)

  // private showOpenRooms: boolean
  // showOpenRoomsSubject$ = new BehaviorSubject<boolean>(undefined)

  constructor(
    // iMe = initMe,
    iChatUserState = initChatUserState,
    iRoomState = initRoomState,
  ) {
    // this.me$.next(iMe)
    this.setChatUserState(iChatUserState)
    this.setRoomState(iRoomState)
    // this.setOpenRoomIds([])
    // this.showOpenRooms = false
    // this.showOpenRoomsSubject$.next(this.showOpenRooms)
  }

  reset() {
    this.setChatUserState(initChatUserState)
    this.setRoomState(initRoomState)
  }

  setMe(newMe: ChatUser) {
    const nextChatUserState = { ...this.chatUserState }
    nextChatUserState.me = newMe
    this.setChatUserState(nextChatUserState)
  }

  setLoggedIn(b = true) {
    const nextChatUserState = { ...this.chatUserState }
    nextChatUserState.isLoggedIn = b
    this.setChatUserState(nextChatUserState)
  }

  setChatUsers(cUsers: ChatUsers) {
    const nCUS = { ...this.chatUserState }
    nCUS.chatUsers = cUsers
    this.setChatUserState(nCUS)
  }

  setChatUserState(newChatUserState: ChatUserState) {
    this.chatUserState = newChatUserState
    this.chatUserState$.next(newChatUserState)
  }

  setRoomState(newRoomList: RoomState) {
    this.roomState = newRoomList
    this.roomState$.next(newRoomList)
  }

  upDateRoom(newRoom: Room) {
    const newRooms: { [roomId: string]: Room } = { ...this.roomState.rooms }
    newRooms.rooms[newRoom.id] = newRoom
    const newRoomList = { ...this.roomState }
    newRoomList.rooms = newRooms
    this.setRoomState(newRoomList)
  }

  toggleRoomListOption() {
    const nextRoomState = { ...this.roomState }
    nextRoomState.showOpenRooms = !nextRoomState.showOpenRooms
    this.setRoomState(nextRoomState)
    // this.showOpenRooms = !this.showOpenRooms
    // this.showOpenRoomsSubject$.next(this.showOpenRooms)
  }

  setOpenRoomIds(newOpenRoomIds: string[]) {
    const nextRoomState = { ...this.roomState }
    nextRoomState.openRoomIds = newOpenRoomIds
    this.setRoomState(nextRoomState)
  }

  openRoom(id: string) {
    if (!this.roomState.openRoomIds.includes(id)) {
      // this.setOpenRoomIds(newOpenRoomIds)
      const nextRoomState = { ...this.roomState }
      const newOpenRoomIds = [id, ...nextRoomState.openRoomIds]
      nextRoomState.openRoomIds = newOpenRoomIds
      this.setRoomState(nextRoomState)
    }
  }

  closeRoom(id: string) {
    if (this.roomState.openRoomIds.includes(id)) {
      // this.setOpenRoomIds(newOpenRoomIds)
      const nextRoomState = { ...this.roomState }
      const newOpenRoomIds = [...nextRoomState.openRoomIds]
      const index = newOpenRoomIds.indexOf(id)
      newOpenRoomIds.splice(index, 1)
      nextRoomState.openRoomIds = newOpenRoomIds
      this.setRoomState(nextRoomState)
    }
  }

}
