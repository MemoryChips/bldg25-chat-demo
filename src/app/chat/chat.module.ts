import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { MaterialModule } from '../material/material.module'

import { ChatMessageService } from './services/chat-message.service'
import { BroadcastMessageComponent } from './components/broadcast-message/broadcast-message.component'
import { MainComponent } from './components/main/main.component'
import { WindowsComponent } from './components/windows/windows.component'
import { ActivatorComponent } from './components/activator/activator.component'
import { TabComponent } from './components/tab/tab.component'
import { TabsDirective } from './components/tab/tabs.directive'
import { OptionsComponent } from './components/options/options.component'
import { RoomComponent } from './components/room/room.component'
import { RoomListComponent } from './components/room-list/room-list.component'
import { RoomListRowComponent } from './components/room-list-row/room-list-row.component'
import { UserListComponent } from './components/user-list/user-list.component'
import { UserListRowComponent } from './components/user-list-row/user-list-row.component'
import { CompositeMessageComponent } from './components/composite-message/composite-message.component'
import 'rxjs/add/operator/filter';
import { TabsComponent } from './components/tabs/tabs.component'

@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
  ],

  declarations: [
    BroadcastMessageComponent,
    MainComponent,
    WindowsComponent,
    ActivatorComponent,
    TabComponent,
    TabsDirective,
    OptionsComponent,
    RoomComponent,
    RoomListComponent,
    RoomListRowComponent,
    UserListComponent,
    UserListRowComponent,
    CompositeMessageComponent,
    TabsComponent
  ],

  exports: [
    BroadcastMessageComponent,
    MainComponent,
  ],

  providers: [
    ChatMessageService
  ]

})
export class ChatModule {
}
