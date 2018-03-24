import { Injectable } from '@angular/core'
import { AuthService, AppUser } from 'app/auth/auth.service'
import { ChatStore } from './chat-store'
// TODO: is there a better way to do this?
import { ChatUser, ChatUsers } from 'app/chat/services/models/chat-user'  // this must be provided by host application

@Injectable()
export class ChatMessageService {

  private chatConnection: WebSocket
  chatStore: ChatStore

  constructor(private auth: AuthService) {
    this.chatStore = new ChatStore()
    this.auth.isLoggedIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.chatStore.setLoggedIn()
        this.connectChat()
      } else {
        this.chatStore.setLoggedIn(false)
        if (this.chatConnection) { this.chatConnection.close() }
      }
    })
    this.auth.userSubject$.subscribe((newUser: AppUser) => {
      if (newUser) {
        const newMe: ChatUser = {
          id: newUser.id,
          userName: newUser.userName,
          isAdmin: newUser.roles.includes('ADMIN'),
          roles: newUser.roles,
          loginTime: newUser.loginTime,
          email: newUser.email,
          active: newUser.active
        }
        this.chatStore.setMe(newMe)
        // if (newMe.id) {
        //   // TODO: setup connection to backend to get chat store updates for three store items
        //   this.chatStore.setChatUserState(testChatUserState)
        //   this.chatStore.setRoomState(testRoomState)
        // }
        // } else { this.chatStore.reset() }
      }
    })
    // this.chatStore = testChatStore
  }

  private connectChat() {
    this.chatConnection = new WebSocket('ws://localhost:4200/api-ws')
    this.chatConnection.onmessage = (m) => {
      try {
        const message = JSON.parse(m.data)
        if (message.type === 'user_list') {
          console.log('Received new user list')
          const payload = JSON.parse(message.payload)
          console.log('Server: ' + payload)
          const chatUsers: ChatUsers = payload
          this.chatStore.setChatUsers(chatUsers)
        } else {
          console.log('Unrecognized message received: ', m.data)
        }
      } catch (error) {
        console.error('Message received from server is not in JSON format: ', m.data)
      }
    }
    window.setTimeout(() => {
      this.chatConnection.send('timer message')
    }, 1000)
  }

  sendAdminMessage(message: string) {
    this.chatConnection.send(message)
  }

  requestChat(_userId: string) {
    console.log(`TODO: Chat request with userid received: ${_userId} `)
  }

}
