import fs = require('fs');
import yaml = require('js-yaml');
import { Room } from './Room';
import { EventBus } from './EventBus';
import { MovementData } from './MovementData';
import { Logger } from './Logger';
import { Enemy } from './Enemy';
import { EnemyManager } from './EnemyManager';
const eventBus: EventBus = require('./EventBus');
const logger: Logger = require('./Logger');
const enemyManager: EnemyManager = require('./EnemyManager');

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
            let roomEnemies = room['enemies'];
            let enemies: Enemy[] = [];
            if(roomEnemies) {
                enemies = this.createEnemies(room['enemies']);
            }
            let createdRoom: Room = new Room(name, description, connectedRoomNames, enemies);
            createdRooms[name] = createdRoom;
        });

        return createdRooms;
    }

    createEnemies(enemies: string[]) {
        let arrayOfEnemies: Enemy[] = enemies.map((enemy) => {
            return enemyManager.getEnemyByName(enemy);
        });

        return arrayOfEnemies;
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
            let roomInfo = "";
            if(roomToMoveTo) {
                this.currentRoom = roomToMoveTo;
                let roomEnemies: Enemy[] = this.currentRoom.getEnemies();
                if(roomEnemies) {
                    roomInfo += this.currentRoom.description + "\n Shit! There are enemies in the room!\n";
                    roomInfo += "The enemies are:";
                    roomEnemies.forEach((enemy) => {
                        logger.log(JSON.stringify(enemy));
                        let enemyName = enemy.getName();
                        roomInfo += "\n" + enemyName;
                    });
                } else {
                    roomInfo += this.currentRoom.description;
                }
                this.eventBus.emitOnMenuBus('updateInfo', roomInfo);
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