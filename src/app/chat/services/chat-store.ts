import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { RoomList, Room, Message, ROOM_TYPES } from './models/room'
import { ChatUser } from './models/chat-user'
import 'rxjs/add/operator/filter'

const initMe: ChatUser = {
  id: '',
  name: '',
  isAdmin: false
}

const initRoomList: RoomList = {
  rooms: {},
  // openRoomIds: [],
  // showOpenRooms: false
}

interface ChatUserState {
  chatUsers: ChatUser[]
}

const initChatUserState: ChatUserState = {
  chatUsers: []
}

export class ChatStore {

  chatUserState$ = new BehaviorSubject<ChatUserState>(undefined)
  me$ = new BehaviorSubject<ChatUser>(undefined)

  private roomList: RoomList
  roomListSubject$ = new BehaviorSubject<RoomList>(undefined)

  private openRoomIds: string[] = []
  openRoomIdsSubject$ = new BehaviorSubject<string[]>(undefined)

  private showOpenRooms: boolean
  showOpenRoomsSubject$ = new BehaviorSubject<boolean>(undefined)

  constructor(
    iMe = initMe,
    iChatUserList = initChatUserState,
    iRoomList = initRoomList,
  ) {
    this.me$.next(iMe)
    this.chatUserState$.next(iChatUserList)
    this.setRoomList(iRoomList)
    this.setOpenRoomIds([])
    this.showOpenRooms = false
    this.showOpenRoomsSubject$.next(this.showOpenRooms)
  }

  setMe(newMe: ChatUser) { this.me$.next(newMe) }

  setChatUserList(newChatUserList: ChatUserState) { this.chatUserState$.next(newChatUserList) }

  setRoomList(newRoomList: RoomList) {
    this.roomList = newRoomList
    this.roomListSubject$.next(newRoomList)
  }

  upDateRoom(newRoom: Room) {
    const newRooms: { [roomId: string]: Room } = {...this.roomList.rooms}
    newRooms.rooms[newRoom.id] = newRoom
    const newRoomList = { ...this.roomList }
    newRoomList.rooms = newRooms
    this.setRoomList(newRoomList)
  }

  toggleRoomListOption() {
    this.showOpenRooms = !this.showOpenRooms
    this.showOpenRoomsSubject$.next(this.showOpenRooms)
  }

  setOpenRoomIds(newOpenRoomIds: string[]) {
    this.openRoomIds = newOpenRoomIds
    this.openRoomIdsSubject$.next(newOpenRoomIds)
  }

  openRoom(id: string) {
    if (!this.openRoomIds.includes(id)) {
      const newOpenRoomIds = [id, ...this.openRoomIds]
      this.setOpenRoomIds(newOpenRoomIds)
      // const mRoom: Room = { ...this.roomList.rooms[id] }
      // mRoom.open = true
      // this.roomList.rooms[id] = mRoom
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

const testChatUserList: ChatUserState = {
  chatUsers: [
    user1,
    user2,
    testMe
  ]
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
  chatUsers: [testMe.id, user1.id],
  messages: [message1, message2],
  // open: true,
  created: 1517514703601,
  type: ROOM_TYPES.OneToOne,
  description: 'Room1'
}
const room2: Room = {
  id: 'roomId2',
  chatUsers: [testMe.id, user2.id],
  messages: [message3],
  // open: true,
  created: 1517514703601,
  type: ROOM_TYPES.OneToOne,
  description: 'Room2'
}

const testRoomList: RoomList = {
  rooms: {
    'roomId1': room1,
    'roomId2': room2
  }
}

// end test data

export const testChatStore = new ChatStore(testMe, testChatUserList, testRoomList)
