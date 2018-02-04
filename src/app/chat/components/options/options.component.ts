import { Component, OnInit } from '@angular/core'
import { ChatMessageService } from 'app/chat/services/chat-message.service'

@Component({
  selector: 'chat-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {

  public showOnlyOpenRooms = false

  constructor(
    private chatMessageService: ChatMessageService
  ) { }

  ngOnInit() {
    this.chatMessageService.chatStore.showOpenRooms$.subscribe((b: boolean) => {
      console.log('Show only open rooms option is now', b)
    })
  }

  toggleRoomListOption() {
    console.log('toggle room list option')
    this.chatMessageService.chatStore.toggleRoomListOption()
  }
}
