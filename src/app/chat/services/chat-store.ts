import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Room, Message, ROOM_TYPES } from './models/room'
import { ChatUser, initMe } from './models/chat-user'
import 'rxjs/add/operator/filter'

interface ChatUserState {
  chatUsers: ChatUser[],
  me: ChatUser
  isLoggedIn: boolean
}

const initChatUserState: ChatUserState = {
  chatUsers: [],
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
    const nextChatUserState = {...this.chatUserState}
    nextChatUserState.me = newMe
    this.setChatUserState(nextChatUserState)
  }

  setLoggedIn(b = true) {
    const nextChatUserState = {...this.chatUserState}
    nextChatUserState.isLoggedIn = b
    this.setChatUserState(nextChatUserState)
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
    const newRooms: { [roomId: string]: Room } = {...this.roomState.rooms}
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

// Test Data Below here

const testMe: ChatUser = {
  id: 'h8kluhg4ryvjcwkgtre',
  name: 'MrAdmin',
  isAdmin: false
}

const user1: ChatUser = {
  id: 'userId1',
  name: 'user one',
  isAdmin: false
}

const user2: ChatUser = {
  id: 'userId2',
  name: 'user two',
  isAdmin: false
}

const student: ChatUser = {
  id: '8unutuvhuc7jcwihhyk',
  name: 'Ms Student',
  isAdmin: false
}

export const testChatUserState: ChatUserState = {
  chatUsers: [
    user1,
    user2,
    testMe,
    student
  ],
  me: testMe,
  isLoggedIn: true
}
const message1: Message = {
  // id: 'messageId1',
  chatUserId: testMe.id,
  text: 'This is message 1',
  timeStamp: 1517514703601
}
const message2: Message = {
  // id: 'messageId1',
  chatUserId: user1.id,
  text: 'This is message 2 from user1',
  timeStamp: 1517514724715
}
const message3: Message = {
  // id: 'messageId1',
  chatUserId: testMe.id,
  text: 'This is message 3 in room 2',
  timeStamp: 1517514703601
}
const room1: Room = {
  id: 'roomId1',
  chatUsers: [testMe, user1],
  messages: [message1, message2],
  // open: true,
  created: 1517514703601,
  type: ROOM_TYPES.OneToOne,
  description: 'Room1'
}
const room2: Room = {
  id: 'roomId2',
  chatUsers: [testMe, user2],
  messages: [message3],
  // open: true,
  created: 1517514703601,
  type: ROOM_TYPES.OneToOne,
  description: 'Room2'
}

export const testRoomState: RoomState = {
  rooms: {
    'roomId1': room1,
    'roomId2': room2
  },
  showOpenRooms: false,
  openRoomIds: []
}

// end test data

// export const testChatStore = new ChatStore(testChatUserList, testRoomState)
