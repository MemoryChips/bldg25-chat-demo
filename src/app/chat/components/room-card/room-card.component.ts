import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { ChatMessageService } from 'app/chat/services/chat-message.service'
import { Subscription } from 'rxjs/Subscription'
import { Room } from 'app/chat/services/models/room'
import { ChatUser } from 'app/chat/services/models/chat-user'

@Component({
  selector: 'chat-room-card',
  templateUrl: './room-card.component.html',
  styleUrls: ['./room-card.component.scss']
})
export class RoomCardComponent implements OnInit, OnDestroy {

  @Input() roomId: string
  room: Room
  me: ChatUser

  private subscriptions: Subscription[] = []

  constructor(
    private chatMessageService: ChatMessageService
  ) { }

  ngOnInit() {
    console.log('Room Card init called with: ', this.roomId)
    this.subscriptions = [
      this.chatMessageService.chatStore.roomListSubject$.subscribe((rl) => {
        const theRoom = rl.rooms[this.roomId]
        if (rl && theRoom !== this.room) {
          this.room = rl.rooms[this.roomId]
        }
      }),
      this.chatMessageService.chatStore.me$
        .subscribe((me) => {
          this.me = me
        })
      // this.chatMessageService.chatStore.chatUserList$
      //   .subscribe((cUsers) => {
      //     this.users = cUsers.chatUsers
      //   })
    ]
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe()
    }
  }

}
