import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs/Subscription'
import { ChatUser } from '../../services/models/chat-user'
import { ChatMessageService } from '../../services/chat-message.service'
import { values, addId } from '../../../shared/utils'

@Component({
  selector: 'chat-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})

export class UserListComponent implements OnInit, OnDestroy {

  localUser: ChatUser
  users: ChatUser[]

  private _subscriptions: Subscription[] = []

  constructor(
    private chatMessageService: ChatMessageService
  ) { }

  ngOnInit() {
    this._subscriptions = [
      this.chatMessageService.chatStore.chatUserState$.subscribe((cus) => {
        if (cus) { this.localUser = cus.me }
      }),
      this.chatMessageService.chatStore.chatUserState$
        // TODO: sort users by name
        // .map((rooms) => {
        //   return values(rooms.rooms).sort((a, b) => {
        //     if (a.id < b.id) { return -1 }
        //     if (a.id > b.id) { return 1 }
        //     return 0
        //   })
        // })
        // TODO: filter local user name OR add (You) to name
        // .filter((rooms) => {
        //   return <not me in cus.me>
        // })
        .subscribe((cUS) => {
          const usersWithId = addId<ChatUser>(cUS.chatUsers)
          this.users = values<ChatUser>(usersWithId)
        })
    ]
  }

  ngOnDestroy() {
    for (const subscription of this._subscriptions) {
      subscription.unsubscribe()
    }
  }

}
