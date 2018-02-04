import { Injectable } from '@angular/core'
import { AuthService } from 'app/auth/auth.service'
import { ChatStore, testChatStore } from './chat-store'

@Injectable()
export class ChatMessageService {

  private chatConnection: WebSocket
  chatStore: ChatStore

  constructor(private auth: AuthService) {
    this.auth.isLoggedIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.connectChat()
      } else {
        if (this.chatConnection) { this.chatConnection.close() }
      }
    })
    this.chatStore = testChatStore
    // setup connection to backend to get chat store updates for three store items
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
