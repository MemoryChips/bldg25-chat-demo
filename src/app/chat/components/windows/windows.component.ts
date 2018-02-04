import { Component, OnInit, OnDestroy } from '@angular/core'
import { ChatUser } from '../../services/models/chat-user'
import { ChatMessageService } from 'app/chat/services/chat-message.service'

@Component({
  selector: 'chat-windows',
  templateUrl: './windows.component.html',
  styleUrls: ['./windows.component.scss']
})
export class WindowsComponent implements OnInit, OnDestroy {

  public atLeastOneRoom: boolean
  public stateOpen = true
  private subscriptions: Array<any> = []

  localUser: ChatUser
  openRoomIds: string[]
  containerWidth = '500px'
  constructor(
    private chatMessageService: ChatMessageService,
  ) { }

  public ngOnInit() {
    this.subscriptions = [
      this.chatMessageService.chatStore.openRoomIds$.subscribe((roomIds: string[]) => {
        console.log('New open rooms:', roomIds)
        if (roomIds.length > 0) {
          this.atLeastOneRoom = true
        } else { this.atLeastOneRoom = false }
      })
      // this.openRoomIds$.subscribe((roomIds: string[]) => {
      //   console.log('New open rooms:', roomIds)
      //   if (roomIds.length > 0) {
      //     this.atLeastOneRoom = true
      //   } else { this.atLeastOneRoom = false }
      // })
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
