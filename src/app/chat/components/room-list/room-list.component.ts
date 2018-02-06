import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs/Subscription'
import { Room } from '../../services/models/room'
import { ChatMessageService } from '../../services/chat-message.service'

function values<T>(obj: { [key: string]: T }): T[] {
  return Object.keys(obj).map(key => obj[key])
}

@Component({
  selector: 'chat-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit, OnDestroy {

  // @select$(['roomListState', 'rooms'], sortRooms) roomList$: Observable<Array<Room>>
  filteredRooms: Room[]
  public localUserId: string

  private subscriptions: Subscription[] = []

  constructor(
    private chatMessageService: ChatMessageService
  ) { }

  ngOnInit() {
    this.subscriptions = [
      this.chatMessageService.chatStore.meSubject$.subscribe((me) => {
        if (me) { this.localUserId = me.id }
      }),
      this.chatMessageService.chatStore.roomListSubject$
        .map((rooms) => {
          if (!rooms) { return [] }
          return values(rooms.rooms).sort((a, b) => {
            if (a.id < b.id) { return -1 }
            if (a.id > b.id) { return 1 }
            return 0
          })
        })
        .subscribe((sRooms) => {
          this.filteredRooms = sRooms
        })
    ]
    // this.filteredRoomList$ = this.roomList$.map((rooms) => {
    //   // add filter here if desired
    //   return rooms
    // })
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe()
    }
  }

}
