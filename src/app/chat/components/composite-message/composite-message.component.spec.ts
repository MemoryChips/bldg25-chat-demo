import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { CompositeMessageComponent } from './composite-message.component'
import { CompositeMessage } from '../models/composite_message'
import { Message } from '../models/message'

const testMessages: Message[] = [
  new Message(
    'messageId111',
    '123',
    5,
    'a message',
    'Jane',
  ),
  new Message(
    'messageId222',
    '123',
    6,
    'a second message',
    'Jane',
  )
]
let testCM: CompositeMessage

describe('CompositeMessageComponent', () => {
  let component: CompositeMessageComponent
  let fixture: ComponentFixture<CompositeMessageComponent>
  testCM = new CompositeMessage({
    messages: testMessages,
    timestamp: 6,
    ownerName: testMessages[0].ownerName
  })

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompositeMessageComponent ]
    })
      .compileComponents()

  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CompositeMessageComponent)
    component = fixture.componentInstance
    component.compositeMessage = testCM
  })

  it('should be created', () => {
    expect(component).toBeTruthy()
  })
  it('should show messages not read', () => {
    component.messagesReadTime = 4
    fixture.detectChanges()
    const de = fixture.debugElement.query(By.css('.message'))
    const el: HTMLElement = de.nativeElement
    expect(el.classList).toContain('message-not-read')
  })
  it('should show messages read', () => {
    component.messagesReadTime = 40
    fixture.detectChanges()
    const de = fixture.debugElement.query(By.css('.message'))
    const el: HTMLElement = de.nativeElement
    expect(el.classList).toContain('message-read')
  })
})
