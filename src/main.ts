import yaml =  require('js-yaml');
import fs = require('fs');
import { Room } from './Room';

interface RoomCollection {
    [key: string]: Room;
}

let nameOfMap = "./rooms.yml";
let file = fs.readFileSync(nameOfMap);
let yamlString = file.toString();
let completeMap = yaml.safeLoad(yamlString);
let rooms: any[] = Object.values(completeMap);

let createdRooms: RoomCollection = {};

rooms.forEach(room => {
    let name: string = room['name'];
    let description = room['description'];
    let connectedRoomNames = room['connectedRooms'];
    let createdRoom: Room = new Room(name, description, connectedRoomNames);
    createdRooms[name] = createdRoom;
});

let allRooms: Room[] = Object.values(createdRooms);

for(let room of allRooms) {
    let refrencesToConnectedRooms: Room[] = [];
    for(let roomName of room.getConnectedRoomNames()) {
        let referenceToConnectedRoom: Room = createdRooms[roomName];
        refrencesToConnectedRooms.push(referenceToConnectedRoom);
    }
    room.setConnectedRooms(refrencesToConnectedRooms);
}

let entrance: Room = createdRooms["Entrance"];