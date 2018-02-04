import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { RoomListRowComponent } from './room-list-row.component'
import { RoomService } from '../../services/room.service'
import { Room } from '../models/room'

class RoomServiceStub {
  // mockRoomListOption = true;
  // toggleRoomListOption() { this.mockRoomListOption = !this.mockRoomListOption; }
}

describe('RoomListRowComponent', () => {
  let component: RoomListRowComponent
  let fixture: ComponentFixture<RoomListRowComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomListRowComponent ],
      providers: [{ provide: RoomService, useClass: RoomServiceStub }]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomListRowComponent)
    component = fixture.componentInstance
    component.room = new Room()
    fixture.detectChanges()
  })

  it('should be created', () => {
    expect(component).toBeTruthy()
  })
})
