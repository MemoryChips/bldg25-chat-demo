import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Chat5'
  answer = ''
  answerDisplay = ''
  showSpinner = false
  showAnswer() {
    this.showSpinner = true
    setTimeout(() => {
      this.answerDisplay = this.answer
      this.showSpinner = false
    }, 2000)
  }
}
