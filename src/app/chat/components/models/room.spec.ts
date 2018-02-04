import { getRoomsFromServerResponse } from './room'
import { roomList } from '../../services/test-data/rooms-test-data'
describe('Room Model', () => {
  // make a test rooms
  const testRooms = getRoomsFromServerResponse(roomList, '59c68dd23c180701ac812994')
  it('should create three rooms with getRoomsFromServerResponse function', () => {
    expect(testRooms[0].description).toBe('Lobby')
    expect(testRooms[1].description).toBe('JaneD')
    expect(testRooms[2].description).toBe('Robert Tamlyn')
    expect(testRooms[0].messages.length).toBe(0)
    expect(testRooms[1].messages.length).toBe(6)
    expect(testRooms[2].messages.length).toBe(1)
    expect(testRooms[2].messages[0].text).toBe('Hello Robert')
    expect(testRooms[2].messages[0].id).toBe('59d3cbc37543ff04ce9ad63d')
    expect(testRooms[2].messages[0].ownerId).toBe('59c68dd23c180701ac812994')
    expect(testRooms[2].messages[0].ownerName).toBe('JohnD')
    expect(testRooms[2].messages[0].timestamp).toBe(1507052483)
  })
})
