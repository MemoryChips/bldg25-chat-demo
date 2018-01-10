import { Injectable } from '@angular/core'
import { AngularFireDatabase } from 'angularfire2/database'
import { addKey } from './product.service'
import { Observable } from 'rxjs/Observable'

export interface Category {
  title: string,
  lead: string,
  key?: string
}

@Injectable()
export class CategoryService {

  constructor(private db: AngularFireDatabase) { }

  getAll() {
    // return this.db.list('/categories', ref => ref.orderByChild('title')).valueChanges()
    return this.db.list('/categories', ref => ref.orderByChild('title')).snapshotChanges()
      .map(addKey) as Observable<Category[]>
  }
}
