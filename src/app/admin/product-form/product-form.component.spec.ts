import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ProductFormComponent } from './product-form.component'
import { Observable, of } from 'rxjs'

import {
  ProductService,
  Product
  // Category
} from 'shared/services/product.service'
import { Router } from '@angular/router'
import { ActivatedRoute } from '@angular/router'

class MockRouter {}
class MockActivatedRoute {}
class MockProductService {
  getList(): Observable<Product[]> {
    return of([])
  }
}

describe('ProductFormComponent', () => {
  let component: ProductFormComponent
  let fixture: ComponentFixture<ProductFormComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductFormComponent],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: ProductService, useClass: MockProductService }
      ]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
