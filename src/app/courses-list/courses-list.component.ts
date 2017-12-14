import { Component, OnInit } from '@angular/core'
import { AngularFireDatabase } from 'angularfire2/database'
import { Observable } from 'rxjs/Observable'

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.scss']
})
export class CoursesListComponent implements OnInit {

  courses$: Observable<any[]>

  constructor(private db: AngularFireDatabase) { }

  ngOnInit() {
    this.courses$ = this.getCourses('/courses')
    this.courses$.subscribe((resp) => {
      console.log(resp)
    })
  }

  getCourses(listPath): Observable<any[]> {
    return this.db.list(listPath).valueChanges()
  }
}
