import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { ChatMessageService } from 'app/chat/services/chat-message.service'
import { Subscription } from 'rxjs/Subscription'
import { Room, Message } from 'app/chat/services/models/room'
import { ChatUser } from 'app/chat/services/models/chat-user'
import { CompositeMessage } from '../composite-message/composite_message'

@Component({
  selector: 'chat-room-card',
  templateUrl: './room-card.component.html',
  styleUrls: ['./room-card.component.scss']
})
export class RoomCardComponent implements OnInit, OnDestroy {

  @Input() roomId: string
  @Input() localUser: ChatUser
  room: Room
  compositeMessages: Array<CompositeMessage> = []
  participants = 'loading...'
  minimized = false

  private subscriptions: Subscription[] = []

  constructor(
    private chatMessageService: ChatMessageService
  ) { }

  ngOnInit() {
    console.log('Room Card init called with: ', this.roomId)
    this.subscriptions = [
      this.chatMessageService.chatStore.roomState$.subscribe((rl) => {
        const theRoom = rl.rooms[this.roomId]
        if (rl && theRoom !== this.room) {
          this.room = rl.rooms[this.roomId]
          this.compositeMessages = this.buildCompositeMessages()
          this.participants = this.biuldParticipants()
        }
      }),
    ]
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe()
    }
  }

  private biuldParticipants(): string {
    let pats = 'You'
    this.room.chatUsers.forEach(c => {
      if (c.id !== this.localUser.id) {
        pats = `${c.name}, ${pats}`
      }
    })
    return pats
  }
  // private buildCompositeMessages(messages: Array<Message>): Array<CompositeMessage> {
  private buildCompositeMessages(): Array<CompositeMessage> {
    const messages = this.room.messages
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
        // TODO: get user list and set ownerName to name
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

}
