import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { AdminProductsComponent } from './admin-products.component'

import { Router } from '@angular/router'
import { DomSanitizer } from '@angular/platform-browser'
import { ProductService, Product } from '../../shared/services/product.service'
import { MaterialModule } from '../../material/material.module'

import { Observable, of } from 'rxjs'

class MockRouter {}
class MockDomSanitizer {}
class MockProductService {
  getList(): Observable<Product[]> {
    return of([])
  }
}

describe('AdminProductsComponent', () => {
  let component: AdminProductsComponent
  let fixture: ComponentFixture<AdminProductsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminProductsComponent],
      imports: [MaterialModule],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: DomSanitizer, useClass: MockDomSanitizer },
        { provide: ProductService, useClass: MockProductService }
      ]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProductsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
