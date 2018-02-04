import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { MockNgRedux, NgReduxTestingModule } from '@angular-redux/store/testing'
import { OptionsComponent } from './options.component'
// import { Observable } from 'rxjs/Observable';

import { RoomActions } from '../../state/room.actions'

class RoomActionsStub {
  mockRoomListOption = true
  toggleRoomListOption() { this.mockRoomListOption = !this.mockRoomListOption }
}

describe('OptionsComponent', () => {
  let component: OptionsComponent
  let fixture: ComponentFixture<OptionsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgReduxTestingModule],
      declarations: [OptionsComponent],
      providers: [{ provide: RoomActions, useClass: RoomActionsStub }]
    })
      .compileComponents()
    MockNgRedux.reset()
  }))

  it('should be created', () => {
    fixture = TestBed.createComponent(OptionsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })
})
