import { Component, OnInit } from '@angular/core'
import { ChatMessageService } from 'app/chat/services/chat-message.service'

@Component({
  selector: 'chat-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  isLoggedIn = false

  constructor(
    private chatMessageService: ChatMessageService
  ) { }

  ngOnInit() {
    this.chatMessageService.chatStore.chatUserState$.subscribe(s => {
      this.isLoggedIn = s.isLoggedIn
    })
  }

}
