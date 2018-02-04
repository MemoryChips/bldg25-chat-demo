import { Component, Input, HostListener } from '@angular/core'
import { ChatMessageService } from '../../services/chat-message.service'
import { Room } from '../../services/models/room'

@Component({
  selector: 'chat-room-list-row',
  templateUrl: './room-list-row.component.html',
  styleUrls: ['./room-list-row.component.scss']
})
export class RoomListRowComponent {

  @Input() room: Room
  public isMouseover = false

  constructor(private chatMessageService: ChatMessageService) { }

  @HostListener('click')
  onClick() {
    this.chatMessageService.chatStore.openRoom(this.room.id)
  }

  @HostListener('mouseover')
  onMouseover() {
    this.isMouseover = true
  }

  @HostListener('mouseleave')
  onMouseleave() {
    this.isMouseover = false
  }

}
