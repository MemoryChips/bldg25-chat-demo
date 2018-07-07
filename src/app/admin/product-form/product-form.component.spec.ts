import {
  ComponentFixture,
  TestBed,
  // tick,
  fakeAsync
} from '@angular/core/testing'
import { NO_ERRORS_SCHEMA } from '@angular/core'

import { ProductFormComponent } from './product-form.component'
import { FormsModule } from '@angular/forms'
import { Observable, of } from 'rxjs'

import {
  ProductService,
  Product
  // Category
} from 'shared/services/product.service'
import { Router } from '@angular/router'
import { ActivatedRoute } from '@angular/router'

class MockRouter {}
class MockActivatedRoute {
  // this.route.snapshot.routeConfig && this.route.snapshot.routeConfig.path
  // const keyId = this.route.snapshot.paramMap.get('id')
  snapshot = {
    routeConfig: {
      path: 'not_a_real_path'
    },
    paramMap: {
      get: () => 'fake_id'
    }
  }
}
class MockProductService {
  getList(): Observable<Product[]> {
    return of([])
  }
  getCategories(): Observable<Product[]> {
    return of([])
  }
  get(_id: string) {
    const fakeProduct: Product = {
      title: 'fake_title',
      price: 12,
      imageUrl: 'an_imageUrl',
      category: 'fake_category',
      key: 'fake_key'
    }
    return of(fakeProduct)
  }
}

describe('ProductFormComponent', () => {
  let component: ProductFormComponent
  let fixture: ComponentFixture<ProductFormComponent>

  beforeEach(
    fakeAsync(() => {
      // TODO: Is fakeasync needed here?
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        declarations: [ProductFormComponent],
        imports: [FormsModule],
        providers: [
          { provide: Router, useClass: MockRouter },
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: ProductService, useClass: MockProductService }
        ]
      }).compileComponents()
    })
  )

  beforeEach(
    fakeAsync(() => {
      fixture = TestBed.createComponent(ProductFormComponent)
      component = fixture.componentInstance
      fixture.detectChanges()
    })
  )

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should have new product setting of false', () => {
    expect(component.newProduct).toBeFalsy()
  })
  it(
    'should get product with correct title',
    fakeAsync(() => {
      expect(component.product.title).toBe('fake_title')
    })
  )
  it('should get product with correct key', () => {
    expect(component.product.key).toBe('fake_key')
  })
})
