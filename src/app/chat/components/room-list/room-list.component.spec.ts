import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { MockNgRedux, NgReduxTestingModule } from '@angular-redux/store/testing'

import { RoomListComponent } from './room-list.component'
import { RoomListRowComponent } from '../room-list-row/room-list-row.component'

describe('RoomListComponent', () => {
  let component: RoomListComponent
  let fixture: ComponentFixture<RoomListComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgReduxTestingModule],
      declarations: [ RoomListComponent, RoomListRowComponent ]
    })
    .compileComponents()
  }))
  MockNgRedux.reset()

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should be created', () => {
    expect(component).toBeTruthy()
  })
})
