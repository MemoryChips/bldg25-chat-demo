import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { UserListRowComponent } from './user-list-row.component'
import { User } from '../../models/user'

import { RoomService } from '../../services/room.service'
class RoomServiceStub {
}
const mockUser = new User({})

describe('UserListRowComponent', () => {
  let component: UserListRowComponent
  let fixture: ComponentFixture<UserListRowComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserListRowComponent ],
      providers: [{ provide: RoomService, useClass: RoomServiceStub }]
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(UserListRowComponent)
    component = fixture.componentInstance
    component.user = mockUser
    component.localUserId = 'xyz'
    fixture.detectChanges()
  })

  it('should be created', () => {
    expect(component).toBeTruthy()
  })
})
