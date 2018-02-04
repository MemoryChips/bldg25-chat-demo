import { Message } from '../../services/models/room'

/**
 * Created by ktamlyn on 7/9/16.
 */
export class CompositeMessage {

  messages: Array<Message>
  ownerName: string
  ownerId: string
  timeStamp = 0

  constructor(params) {
    // set defaults
    this.messages = []
    this.ownerName = null
    // this.room = null;

    // override only params that are passed in
    Object.assign(this, params)

    if (this.messages.length > 0) {
      this.timeStamp = this.messages[this.messages.length - 1].timeStamp
    } else {
      this.timeStamp = 2
    }
  }
// export class CompositeMessage {

//   messages: Array<Message>;
//   ownerName: string;
//   ownerId: string;
//   timestamp = 0;

//   constructor(params) {
//     // set defaults
//     this.messages = [];
//     this.ownerName = null;
//     // this.room = null;

//     // override only params that are passed in
//     Object.assign(this, params);

//     if (this.messages.length > 0) {
//       this.timestamp = this.messages[this.messages.length - 1].timestamp;
//     } else {
//       this.timestamp = 2;
//     }
//   }

  getText(): string {
    let text = ''
    for (const m of this.messages) {
      text += '<p>' + m.text + '</p>'
    }
    return text
  }

  getTime() {
    let date: Date
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    if (this.messages.length === 0) {
      date = new Date()
    } else {date = new Date(this.messages[this.messages.length - 1].timeStamp * 1000) }
    // Hours part from the timestamp
    const hours = date.getHours()
    // Minutes part from the timestamp
    const minutes = '0' + date.getMinutes()
    // Seconds part from the timestamp
    const seconds = '0' + date.getSeconds()

    // Will display time in 10:30:23 format
    const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)
    return formattedTime
  }

  getLabel() {
    return this.ownerName
  }

}
