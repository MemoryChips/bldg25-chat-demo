import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { MockNgRedux, NgReduxTestingModule } from '@angular-redux/store/testing'

import { FormsModule } from '@angular/forms'

import { RoomComponent } from './room.component'
import { CompositeMessageComponent } from '../composite-message/composite-message.component'
import { RoomService } from '../../services/room.service'
import { RoomActions } from '../../state/room.actions'
import { Room, ROOM_TYPES } from '../models/room'
class RoomServiceStub {
}

class RoomActionsStub {
}

const ROOM_ID = '123'

describe('RoomComponent', () => {
  let component: RoomComponent
  let fixture: ComponentFixture<RoomComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomComponent, CompositeMessageComponent ],
      providers: [
        { provide: RoomService, useClass: RoomServiceStub },
        { provide: RoomActions, useClass: RoomActionsStub }
      ],
      imports: [FormsModule, NgReduxTestingModule]
    })
      .compileComponents()
    MockNgRedux.reset()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomComponent)
    component = fixture.componentInstance
    component.roomId = ROOM_ID
    fixture.detectChanges()
  })

  it('should be created', () => {
    expect(component).toBeTruthy()
  })

  it('should select room from room store', () => {
    const mockRoomSequence = [
      new Room(
        '123',
        new Date(5),
        ROOM_TYPES.Lobby
      ),
      new Room(
        '123',
        new Date(5),
        ROOM_TYPES.Lobby,
        [],
        [],
        true,
        true,
        'a description'
      ),
    ]
    const roomStub = MockNgRedux.getSelectorStub(['roomListState', 'rooms', ROOM_ID])
    // mockRoomSequence.forEach(r => roomStub.next(r));
    // roomStub.complete();
    roomStub.next(mockRoomSequence[0])
    expect(component.description).toEqual('')
    roomStub.next(mockRoomSequence[1])
    expect(component.description).toContain('a description')
  })
})
