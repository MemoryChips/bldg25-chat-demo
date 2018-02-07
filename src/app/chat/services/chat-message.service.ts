import { Injectable } from '@angular/core'
import { AuthService, AppUser } from 'app/auth/auth.service'
import { ChatStore, testChatUserState, testRoomState } from './chat-store'
// TODO: is there a better way to do this?
import { ChatUser } from 'app/chat/services/models/chat-user'  // this must be provided by host application

@Injectable()
export class ChatMessageService {

  private chatConnection: WebSocket
  chatStore: ChatStore

  constructor(private auth: AuthService) {
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
          name: newUser.userName,
          isAdmin: newUser.roles.includes('ADMIN'),
          // isLoggedIn: newUser.isLoggedIn
        }
        this.chatStore.setMe(newMe)
        if (newMe.id) {
          // TODO: setup connection to backend to get chat store updates for three store items
          this.chatStore.setChatUserState(testChatUserState)
          this.chatStore.setRoomState(testRoomState)
        }
        // } else { this.chatStore.reset() }
      }
    })
    this.chatStore = new ChatStore()
    // this.chatStore = testChatStore
  }

  private connectChat() {
    this.chatConnection = new WebSocket('ws://localhost:4200/api-ws')
    this.chatConnection.onmessage = (m) => { console.log('Server: ' + m.data) }
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
