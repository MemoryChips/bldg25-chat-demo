// import { Message } from './message'

// export class CompositeMessage {

//   messages: Array<Message>
//   ownerName: string
//   ownerId: string
//   timestamp = 0

//   constructor(params) {
//     this.messages = []
//     this.ownerName = null
//     Object.assign(this, params)
//     if (this.messages.length > 0) {
//       this.timestamp = this.messages[this.messages.length - 1].timestamp
//     } else {
//       this.timestamp = 2
//     }
//   }

//   getText(): string {
//     let text = ''
//     for (const m of this.messages) {
//       text += '<p>' + m.text + '</p>'
//     }
//     return text
//   }

//   getTime() {
//     let date: Date
//     if (this.messages.length === 0) {
//       date = new Date()
//     } else {date = new Date(this.messages[this.messages.length - 1].timestamp * 1000) }
//     const hours = date.getHours()
//     const minutes = '0' + date.getMinutes()
//     const seconds = '0' + date.getSeconds()
//     // Will display time in 10:30:23 format
//     const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)
//     return formattedTime
//   }

//   getLabel() {
//     return this.ownerName
//   }

// }
