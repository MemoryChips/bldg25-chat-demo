import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'chat-room-card',
  templateUrl: './room-card.component.html',
  styleUrls: ['./room-card.component.scss']
})
export class RoomCardComponent implements OnInit {

  @Input() roomId: string

  constructor() { }

  ngOnInit() {
    console.log('Room Card init called with: ', this.roomId)
  }

}
