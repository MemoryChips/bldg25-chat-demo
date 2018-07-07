import { TestBed, async } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { AppComponent } from './app.component'
import { CoreModule } from './core/core.module'
import { RouterTestingModule } from '@angular/router/testing'

import { ChatModule } from 'bldg25-chat'
import { environment } from '../environments/environment'

import { ActivatedRoute } from '@angular/router'
import { AuthService } from './auth/auth.service'
import { ShoppingCartService } from './shared/services/shopping-cart.service'
import { of } from 'rxjs'

class MockAuthService {
  user$ = of({})
  isLoggedIn$ = of(false)
}
class MockShoppingCartService {
  cart$ = of({})
}
class MockActivatedRoute {
  snapshot = {
    routeConfig: {
      path: 'not_a_real_path'
    },
    paramMap: {
      get: () => 'fake_id'
    }
  }
}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        ChatModule,
        CoreModule,
        ChatModule.forRoot(environment.chatConfig),
        RouterTestingModule
      ],
      providers: [
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: AuthService, useClass: MockAuthService },
        { provide: ShoppingCartService, useClass: MockShoppingCartService }
      ],
      declarations: [AppComponent]
    }).compileComponents()
  }))
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.debugElement.componentInstance
    expect(app).toBeTruthy()
  }))
  it(`should have as title 'Chat 6 Demo'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.debugElement.componentInstance
    expect(app.title).toEqual('Chat 6 Demo')
  }))
  // it('should render title in a h1 tag', async(() => {
  //   const fixture = TestBed.createComponent(AppComponent)
  //   fixture.detectChanges()
  //   const compiled = fixture.debugElement.nativeElement
  //   expect(compiled.querySelector('h1').textContent).toContain(
  //     'Welcome to app!'
  //   )
  // }))
})
