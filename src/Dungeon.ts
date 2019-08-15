import fs = require('fs');
import yaml = require('js-yaml');
import { Room } from './Room';
import { create } from 'domain';

interface RoomCollection {
    [key: string]: Room;
}
export class Dungeon {
    rooms: Room[];
    entrance: Room;
    currentRoom: Room;

    constructor(filename: string) {
        this.createDungeon(filename);
    }

    createDungeon(filename: string) {
        let rooms: any[] = this.readInRooms(filename);
        let createdRooms: RoomCollection = this.createRoomsFromData(rooms);
        let allRooms: Room[] = Object.values(createdRooms);

        let finalRooms: Room[] = this.setupConnectedRooms(allRooms, createdRooms);
        this.rooms = finalRooms;
        this.entrance = this.rooms[0];
        this.currentRoom = this.entrance;
    }

    readInRooms(filename: string) {
        let file = fs.readFileSync(filename);
        let yamlString = file.toString();
        let completeMap = yaml.safeLoad(yamlString);
        let rooms: any[] = Object.values(completeMap);
        return rooms;
    }

    createRoomsFromData(rooms: any[]) {
        let createdRooms: RoomCollection = {};
        rooms.forEach(room => {
            let name: string = room['name'];
            let description = room['description'];
            let connectedRoomNames = room['connectedRooms'];
            let createdRoom: Room = new Room(name, description, connectedRoomNames);
            createdRooms[name] = createdRoom;
        });

        return createdRooms;
    }

    setupConnectedRooms(rooms: Room[], createdRooms: RoomCollection) {
        for (let room of rooms) {
            let refrencesToConnectedRooms: Room[] = [];
            for (let roomName of room.getConnectedRoomNames()) {
                let referenceToConnectedRoom: Room = createdRooms[roomName];
                refrencesToConnectedRooms.push(referenceToConnectedRoom);
            }
            room.setConnectedRooms(refrencesToConnectedRooms);
        }
        return rooms;
    }

}