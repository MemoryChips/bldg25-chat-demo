import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ActionComponent } from './action.component'
import { Router } from '@angular/router'
import { Product } from '../../../shared/services/product.service'

const exampleProduct: Product = { title: '', category: '', imageUrl: '', key: 'xyz', price: 10 }
class MockRouter {
  navigate(_params: [string, Product]) {}
}

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
    component.column = 4
    component.data = exampleProduct
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
  it('should navigate to edit route', () => {
    const router: MockRouter = TestBed.get(Router)
    const spy = spyOn(router, 'navigate')
    // push button for edit route instead of direct call?
    component.editProductClicked()
    // expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith(['admin/products', exampleProduct.key])
  })
})
