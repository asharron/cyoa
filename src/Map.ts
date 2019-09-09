import fs = require('fs');
import yaml = require('js-yaml');
import { Room } from './Room';
import { EventBus } from './EventBus';
import { MovementData } from './MovementData';
import { Logger } from './Logger';
const eventBus: EventBus = require('./EventBus');
const logger: Logger = require('./Logger');

interface RoomCollection {
    [key: string]: Room;
}
export class Map {
    rooms: Room[];
    entrance: Room;
    currentRoom: Room;
    eventBus: EventBus;

    constructor(filename: string) {
        this.eventBus = eventBus;
        this.createDungeon(filename);
        this.setupListeners();
    }

    createDungeon(filename: string) {
        let rooms: any[] = this.readInRooms(filename);
        let createdRooms: RoomCollection = this.createRoomsFromData(rooms);
        let allRooms: Room[] = Object.values(createdRooms);

        let finalRooms: Room[] = this.setupConnectedRooms(allRooms, createdRooms);
        this.rooms = finalRooms;
        this.entrance = this.rooms[0];
        this.currentRoom = this.entrance;
        this.eventBus.emitOnMenuBus('updateInfo', this.currentRoom.description);
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

    setupListeners() {
        this.eventBus.onMapBus('move', (moveInfo: MovementData) => {
            let nameToSearchFor = moveInfo.connectedRoomName;
            let roomToMoveTo: Room = this.currentRoom.getRoomByName(nameToSearchFor);
            if(roomToMoveTo) {
                logger.log("Foud the next room!");
                this.currentRoom = roomToMoveTo;
                this.eventBus.emitOnMenuBus('updateInfo', this.currentRoom.description);
            } else {
                logger.log("Did not find the next room.");
            }
        });

        this.eventBus.onMapBus('look', () => {
            let connectedRooms = this.currentRoom.getConnectedRoomNames();
            let msg = "You look around the room and see that you can move to: " + connectedRooms.join(", ");
            this.eventBus.emitOnMenuBus('updateInfo', msg);
        });
    }
}