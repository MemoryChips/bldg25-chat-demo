import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ActionComponent } from './action.component'
import { Router } from '@angular/router'

class MockRouter {}

describe('ActionComponent', () => {
  let component: ActionComponent
  let fixture: ComponentFixture<ActionComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActionComponent],
      providers: [{ provide: Router, useClass: MockRouter }]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
