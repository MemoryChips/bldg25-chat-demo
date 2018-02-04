// import { Message } from './message'
// import { CompositeMessage } from './composite_message'
// import { Observable } from 'rxjs/Observable'

// function objectValues(obj: Object): any[] { return Object.keys(obj).map(key => obj[key]) }

// function sortArray(values: any[], prop: string): any[] {
//   return values.sort((a, b) => {
//     if (a[prop] < b[prop]) { return -1 }
//     if (a[prop] > b[prop]) { return 1 }
//     return 0
//   })
// }
// export const sortRooms = (roomDictionary$: Observable<{}>) =>
//   roomDictionary$.map(
//     (roomstate) => sortArray(objectValues(roomstate), 'id')
//   )

// export enum ROOM_TYPES { Named, Lobby, OneToOne, Private }
// export enum ROOM_LAYOUTS { OneToOne, Small, Large }
// export enum ROOM_STATES { Idle, Sending }

// export function createRoomFromServerResponse(roomData, localUserId: string = ''): Room {
//   //
//   let participants: Participant[] = []
//   if (roomData.participants) {
//     participants = roomData.participants.map((p) => {
//       return new Participant(
//         p.id,
//         p.email,
//         p.name,
//         p.lastViewTime
//       )
//     })
//   }
//   let messages: Message[] = []
//   if (roomData.messages) {
//     messages = roomData.messages.map((m) => {
//       return new Message(
//         m.id,
//         m.ownerId,
//         m.timestamp,
//         m.text,
//         m.ownerName
//       )
//     })
//   }
//   // Construct rooms from server response
//   const r: Room = new Room(
//     roomData.id,
//     roomData.created,
//     roomData.type,
//     participants,
//     messages
//   )
//   r.setDescription(localUserId)
//   console.log(r)
//   return r
// }
// /*
//   * Create Rooms from Server Response
//   */
// export function getRoomsFromServerResponse(roomsServerData: any[], localUserId: string): Room[] {
//   const rooms: Room[] = roomsServerData.map((roomData) => {
//     return createRoomFromServerResponse(roomData, localUserId)
//   })
//   return rooms
// }

// export class Participant {
//   constructor(
//     public userId: 'string',
//     public email = 'string',
//     public name = 'not given',
//     public lastViewTime = 0
//   ) {}
// }
// export class Room {

//   compositeMessages: Array<CompositeMessage>

//   constructor(
//     public id = 'not supplied',
//     public created = new Date(0),
//     public type: ROOM_TYPES = ROOM_TYPES.OneToOne,
//     public participants: Participant[] = [],
//     public messages: Message[] = [],
//     public open = true,
//     public minimized = false,
//     public description = '',
//   ) {}

//   public setDescription(localUserId: string): void {
//     if (this.type === ROOM_TYPES.Lobby) {
//      this.description = 'Lobby'
//     } else {
//       this.description = ''
//       for (const participant of this.participants) {
//         if (localUserId && participant.userId === localUserId) { continue }
//         const name = participant.name || participant.email || 'no name supplied'
//         if (this.description === '') {
//           this.description = name
//         } else {
//           this.description += ', ' + name
//         }
//       }
//     }
//     // console.log('description created: ', this.description);
//   }

// }
