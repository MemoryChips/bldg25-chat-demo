import { Component, OnInit, OnDestroy } from '@angular/core'
import { ChatUser } from '../../services/models/chat-user'
import { ChatMessageService } from 'app/chat/services/chat-message.service'

@Component({
  selector: 'chat-windows',
  templateUrl: './windows.component.html',
  styleUrls: ['./windows.component.scss']
})
export class WindowsComponent implements OnInit, OnDestroy {

  atLeastOneRoom = false
  stateOpen = true

  localUser: ChatUser
  openRoomIds: string[]
  // openRoomIds = ['room1', 'romm2']
  containerWidth = '600px'
  numRooms = 0

  private subscriptions: Array<any> = []

  constructor(
    private chatMessageService: ChatMessageService,
  ) { }

  public ngOnInit() {
    this.subscriptions = [
      this.chatMessageService.chatStore.openRoomIds$.subscribe((roomIds: string[]) => {
        this.openRoomIds = roomIds
        console.log('New open rooms:', this.openRoomIds)
        if (this.openRoomIds.length > 0) {
          this.numRooms = this.openRoomIds.length
          this.atLeastOneRoom = true
        } else { this.atLeastOneRoom = false }
      }),
      this.chatMessageService.chatStore.meSubject$.subscribe((me: ChatUser) => {
        this.localUser = me
        console.log('New local user in windows comp:', this.localUser.id)
      }),
    ]
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe()
    }
  }

  public toggle() {
    this.stateOpen = !this.stateOpen
  }

}
