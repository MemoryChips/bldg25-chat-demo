import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'

import { ProductFilterComponent } from './product-filter.component'
import { ProductService, Category } from 'shared/services/product.service'

import { of } from 'rxjs'

const exampleCategories: Category[] = [
  {
    title: 'example cat',
    lead: 'leader',
    key: 'zaq'
  }
]
class MockProductService {
  getCategories(_key: string) {
    return of(exampleCategories)
  }
}

describe('ProductFilterComponent', () => {
  let component: ProductFilterComponent
  let fixture: ComponentFixture<ProductFilterComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: ProductService, useClass: MockProductService }],
      declarations: [ProductFilterComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFilterComponent)
    component = fixture.componentInstance
    component.categoryKey = 'example-key'
    // component.ngOnInit()
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
