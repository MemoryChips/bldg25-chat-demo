import { Component, Input } from '@angular/core'
import { CompositeMessage } from './composite_message'

@Component({
  selector: 'chat-composite-message',
  templateUrl: './composite-message.component.html',
  styleUrls: ['./composite-message.component.scss']
})
export class CompositeMessageComponent {

  @Input() compositeMessage: CompositeMessage
  @Input() messagesReadTime = 2
  isRead(): boolean {
    return this.messagesReadTime > this.compositeMessage.timeStamp
  }
}
