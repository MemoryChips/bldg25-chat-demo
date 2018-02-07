import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core'
// import { TabsDirective } from '../tab/tabs.directive'
import { TabsDirective } from '../tab/tabs.directive'
// import { select, select$ } from '@angular-redux/store';
import { ChatMessageService } from '../../services/chat-message.service'
// import { ChatUser } from '../../services/models/chat-user'
// import { Room } from '../../services/models/room'
// import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
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

  // @select$(['roomListState', 'rooms'], sortRooms) rooms$: Observable<Room[]>;
  // @select(['roomListState', 'openRoomIds']) openRoomIds$: Observable<string[]>;
  // @select(['userState', 'usersList']) users$: Observable<User[]>;
  // @select(['roomListState', 'showOnlyOpenRooms']) showOnlyOpenRooms$: Observable<boolean>;
  numRooms: number
  numOpenRooms: number
  numUsers: number

  openState = false
  showOnlyOpenRooms = false
  showOpenRooms = false

  ActivatorTabs: Object = ActivatorTabs

  private _subscriptions: Subscription[]

  constructor(
    private chatMessageService: ChatMessageService
  ) {
    this.ActivatorTabs = ActivatorTabs
  }

  ngOnInit() {
    this._subscriptions = [
      // this.chatMessageService.chatStore.showOpenRoomsSubject$.subscribe((show) => {
      //   this.showOnlyOpenRooms = show
      // }),
      // this.chatMessageService.chatStore.openRoomIdsSubject$.subscribe((list) => {
      //   this.numOpenRooms = list.length || 0
      // }),
      this.chatMessageService.chatStore.roomState$.subscribe((roomState) => {
        if (roomState) {
          this.numRooms = Object.keys(roomState.rooms).length || 0 // map object to values
          this.showOnlyOpenRooms = roomState.showOpenRooms
          this.numOpenRooms = roomState.openRoomIds.length
        }
      }),
      this.chatMessageService.chatStore.chatUserState$.subscribe((chatUserList) => {
        this.numUsers = chatUserList.chatUsers.length
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
    this.openState = !this.openState
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
