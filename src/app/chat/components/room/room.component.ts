// tslint suggests using Renderer2
import {
  Component, ElementRef, EventEmitter, HostBinding, Input, Output,
  ViewChild, AfterViewInit, AfterViewChecked, Renderer, OnInit, OnDestroy
} from '@angular/core'
import { NgForm } from '@angular/forms'
import { Message } from '../../services/models/room'
// import { Room, Participant, ROOM_STATES, ROOM_LAYOUTS, ROOM_TYPES } from '../models/room'
// import { ChatStore } from '../../services/chat-store'
import { ROOM_TYPES, ROOM_LAYOUTS } from '../../services/models/room'
import { ChatUser } from '../../services/models/chat-user'
import { ChatMessageService } from '../../services/chat-message.service'

import { CompositeMessage } from '../composite-message/composite_message'
// import { NgRedux } from '@angular-redux/store'
// import { IAppState } from '../../state/store'
// import { RoomActions } from '../../state/room.actions'

// This service must be provided by the main site application
// and eventually the rest api backend
// import { RoomService } from '../../services/room.service'

const RoomConfig = {
  LAYOUT_1to1_WINDOW_WIDTH: 20,
  LAYOUT_LARGE_WINDOW_WIDTH: 30,
  LAYOUT_SMALL_WINDOW_WIDTH: 16
}

@Component({
  selector: 'chat-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements AfterViewInit, AfterViewChecked, OnInit, OnDestroy {

  @Output() closeRoom = new EventEmitter()
  // @Input() roomId: string
  @Input() roomId: string
  @Input() localUser: ChatUser

  @ViewChild('messagesFrame') messageWindow: ElementRef
  @ViewChild('messagesInput') vc: ElementRef
  @HostBinding('class.minimized') minimized: boolean

  public description: string

  public compositeMessages: Array<CompositeMessage> = []
  private layout = ROOM_LAYOUTS.OneToOne
  private type: ROOM_TYPES
  public lockedToEnd: boolean
  // private roomState = ROOM_STATES.Idle
  private updateScroll: boolean
  private theMessageList: Message[] = []
  private theParticipants: string[]
  public messagesReadTime = 10

  private subscriptions: Array<any> = []

  constructor(
    private chatMessageService: ChatMessageService,
    // private sailsService: SailsService,
    // private ngRedux: NgRedux<IAppState>,
    // private roomActions: RoomActions,
    private renderer: Renderer
  ) {
    // TODO: add conditional that turns off locked to end if user uses scrollbar
    this.lockedToEnd = true
    this.updateScroll = true
    this.minimized = false
  }

  ngOnInit() {
    console.log('Room component init called:', this.roomId)
    // is it possible to subscribe to only my room?
    // const theRoom$ = this.ngRedux.select(['roomListState', 'rooms', this.roomId])
    this.subscriptions = [
      this.chatMessageService.chatStore.roomList$.subscribe((roomList) => {
        const theRoom = roomList.rooms[this.roomId]
        // theRoom$.subscribe((theRoom: Room) => {
        // this.roomState = ROOM_STATES.idle;
        // this.layout = ROOM_LAYOUTS.oneToOne;
        if (theRoom) {
          // Check for participant update
          if (this.theParticipants !== theRoom.chatUsers) {
            this.theParticipants = theRoom.chatUsers
          }
          // Check for message update
          if (this.theMessageList !== theRoom.messages) {
            console.log('Updating messages for this room: ', this.roomId)
            this.theMessageList = theRoom.messages
            this.compositeMessages = this.buildCompositeMessages(theRoom.messages)
          } else {
            console.log('Avoided updating message list in room: ', this.roomId)
          }
          this.description = theRoom.description
        }
        if (theRoom && theRoom.type) {
          this.type = theRoom.type
          // if (ROOM_TYPES[theRoom.type] === ROOM_TYPES[ROOM_TYPES.LOBBY]) {
          if (theRoom.type === ROOM_TYPES.Lobby) {
            this.layout = ROOM_LAYOUTS.Large
          } else if (theRoom.type.valueOf() === ROOM_TYPES.Lobby) {
            this.layout = ROOM_LAYOUTS.Small
          }
        }
      })
    ]
  }

  ngAfterViewInit() {
    this.renderer.invokeElementMethod(this.vc.nativeElement, 'focus')
  }

  clearSubscriptions() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe()
    }
  }

  ngOnDestroy() {
    this.clearSubscriptions()
  }

  ngAfterViewChecked() {
    // TODO: is this the best hook to use here?
    if (this.updateScroll) {
      this.updateScroll = false
      this.scrollToEnd()
    }
  }

  buildCompositeMessages(messages: Array<Message>): Array<CompositeMessage> {

    const newCompMessages: CompositeMessage[] = []
    let currentCompositeMessage: CompositeMessage = null
    const allowedTimeDifference = 60
    let previousMessage: Message = null

    for (const message of messages) {
      if (currentCompositeMessage === null ||
        (previousMessage && ((previousMessage.timeStamp > message.timeStamp + allowedTimeDifference) ||
          previousMessage.chatUserId !== message.chatUserId))
      ) {
        let ownerName = 'Me' // set ownerName here
        if (this.localUser.id !== message.chatUserId) { ownerName = message.chatUserId }
        currentCompositeMessage = new CompositeMessage({ ownerId: message.chatUserId, ownerName })
        newCompMessages.push(currentCompositeMessage)
      }
      currentCompositeMessage.messages.push(message)
      // currentCompositeMessage.timestamp = 3;
      currentCompositeMessage.timeStamp = message.timeStamp
      previousMessage = message
    }
    return newCompMessages
  }

  scrollToEnd() {
    if (!this.minimized && this.messageWindow != null) {
      const messageWindow = this.messageWindow.nativeElement
      messageWindow.scrollTop = messageWindow.scrollHeight
    }
  }

  submitMessage(_f: NgForm) {

    // this.roomState = ROOM_STATES.Sending
    // this.roomService.sendMessage(this.roomId, f.value.newMessageText).subscribe((data) => {
    //   f.resetForm()
    //   this.renderer.invokeElementMethod(this.vc.nativeElement, 'focus')
    // }, (err) => {
    //   console.error('Error submitting message: ', err)
    // })
    // // turn on locked to end when a message is sent
    // this.lockedToEnd = true
    // return false
  }

  onCloseRoom() {
    // this.roomActions.setRoomOpen(this.roomId, false)
    // // TODO: Clean up the process of closing the lobby
    // if (this.type === ROOM_TYPES.Lobby) { this.roomService.roomClosed(this.roomId) }
  }

  onToggleMinimize() {
    this.minimized = (this.minimized) ? false : true
  }

  toggleShowParticipants() {
    this.layout = (this.layout === ROOM_LAYOUTS.Small) ?
      ROOM_LAYOUTS.Large : ROOM_LAYOUTS.Small
  }

  showParticipantButton() {
    return (!this.minimized && (this.type !== ROOM_TYPES.OneToOne))
    // return (!this.minimized && (this.type !== '1to1'));
  }

  showParticipantColumn() {
    return (!this.minimized && (this.layout === ROOM_LAYOUTS.Large))
  }

  getWidth() {
    let width: number = RoomConfig.LAYOUT_1to1_WINDOW_WIDTH
    if (this.layout === ROOM_LAYOUTS.Large) { width = RoomConfig.LAYOUT_LARGE_WINDOW_WIDTH }
    if (this.minimized) { width = RoomConfig.LAYOUT_SMALL_WINDOW_WIDTH }
    return width
  }

}
