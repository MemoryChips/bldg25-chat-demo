import { Component, OnInit } from '@angular/core'
import { ChatMessageService } from 'app/chat/services/chat-message.service'
import { MatSnackBar } from '@angular/material'

@Component({
  selector: 'chat-broadcast-message',
  templateUrl: './broadcast-message.component.html',
  styleUrls: ['./broadcast-message.component.scss']
})
export class BroadcastMessageComponent implements OnInit {

  message = ''
  constructor(
    private chatMessageService: ChatMessageService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  submitMessage(data: any) {
    // debugger
    console.log(data.value.message)
    this.chatMessageService.sendAdminMessage(data.value.message)
    this.openSnackBar('Message sent', 'Dismiss')
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    })
  }

}
