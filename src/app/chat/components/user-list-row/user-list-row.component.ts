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
  // < img src= "https://www.gravatar.com/avatar/0552e84a05a43a28eb321641d31c63ed?s=40" />
  public avatar = ''   // use md5 on email even if email is unreal


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
