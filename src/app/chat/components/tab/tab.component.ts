import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'chat-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent implements OnInit {

  @Input() name: string
  @Input() id: number
  @Input() active: Boolean = false

  @Output() minimizeTab = new EventEmitter()

  onToggleMinimize() {
    this.minimizeTab.emit()
  }

  constructor() { }

  ngOnInit() {
  }

}
