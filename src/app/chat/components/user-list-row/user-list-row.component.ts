import { Component, Input, HostListener, OnInit } from '@angular/core'
// import { Subscription } from 'rxjs/Subscription'
import { ChatUser } from '../../services/models/chat-user'
import { ChatMessageService } from '../../services/chat-message.service'


@Component({
  selector: 'chat-user-list-row',
  templateUrl: './user-list-row.component.html',
  styleUrls: ['./user-list-row.component.scss']
})
export class UserListRowComponent implements OnInit {


  @Input() localUserId: string
  @Input() user: ChatUser
  public isMouseover = false
  public isLocalUser = false

  // private subscriptions: Subscription[] = []

  constructor(private chatMessageService: ChatMessageService) { }

  ngOnInit() {
    this.isLocalUser = this.localUserId === this.user.id
  }

  @HostListener('click')
  onClick() {
    this.chatMessageService.requestChat(this.user.id)
  }

  @HostListener('mouseover')
  onMouseover() {
    this.isMouseover = true
  }

  @HostListener('mouseleave')
  onMouseleave() {
    this.isMouseover = false
  }

}
