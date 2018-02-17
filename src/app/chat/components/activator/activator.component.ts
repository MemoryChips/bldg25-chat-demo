import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core'
import { TabsDirective } from '../tab/tabs.directive'
import { ChatMessageService } from '../../services/chat-message.service'
// import { ChatUser } from '../../services/models/chat-user'
// import { Room } from '../../services/models/room'
// import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import { ChatUser } from 'app/chat/services/models/chat-user'
// import { Room, sortRooms } from '../models/room';

export enum ActivatorTabs {
  OPTIONS = 1,
  USERS = 2,
  ROOMS = 3
}

// export function values<T>(obj: { [key: string]: T }): T[] {
//   return Object.keys(obj).map(key => obj[key])
// }

@Component({
  selector: 'chat-activator',
  templateUrl: './activator.component.html',
  styleUrls: ['./activator.component.scss']
})
export class ActivatorComponent implements OnInit, OnDestroy {

  @ViewChild(TabsDirective) tabsDirective: TabsDirective

  numRooms: number
  numOpenRooms: number
  numUsers: number

  openState = false
  showOnlyOpenRooms = false
  showOpenRooms = false
  me: ChatUser

  ActivatorTabs: Object = ActivatorTabs

  private _subscriptions: Subscription[]

  constructor(
    private chatMessageService: ChatMessageService
  ) {
    this.ActivatorTabs = ActivatorTabs
  }

  ngOnInit() {
    this._subscriptions = [
      this.chatMessageService.chatStore.roomState$.subscribe((roomState) => {
        if (roomState) {
          this.numRooms = Object.keys(roomState.rooms).length || 0
          this.showOnlyOpenRooms = roomState.showOpenRooms
          this.numOpenRooms = roomState.openRoomIds.length
        }
      }),
      this.chatMessageService.chatStore.chatUserState$.subscribe((chatUserState) => {
        this.numUsers = Object.keys(chatUserState.chatUsers).length
        this.me = chatUserState.me
      }),
    ]
  }

  ngOnDestroy() {
    this._subscriptions.forEach(s => s.unsubscribe())
  }

  toggleActivator(event: Event) {
    // prevent dblclick text selection
    window.getSelection().removeAllRanges()
    event.preventDefault()
    if (this.me.id) { this.openState = !this.openState }
  }

  toggleOptions() {
    this.tabsDirective.setTab(ActivatorTabs.OPTIONS)
  }

  toggleUsers() {
    this.tabsDirective.setTab(ActivatorTabs.USERS)
  }

  toggleRooms() {
    this.tabsDirective.setTab(ActivatorTabs.ROOMS)
  }

}
