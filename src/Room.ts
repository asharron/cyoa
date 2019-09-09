import { Enemy } from "./Enemy";

export class Room {
    name: string;
    description: string;
    connectedRoomNames: string[];
    connectedRooms: Room[];
    enemies: Enemy[];

    constructor(name: string, description: string, connectedRoomNames: string[], enemies: Enemy[]) {
        this.name = name;
        this.description = description;
        this.connectedRoomNames = connectedRoomNames;
        this.enemies = enemies;
    }
    
    getConnectedRoomNames() {
        return this.connectedRoomNames;
    }

    getConnectedRooms() {
        return this.connectedRooms;
    }
    
    getRoomName() {
        return this.name;
    }

    getRoomByName(name: string) {
        let foundRoom: Room;

        for(let room of this.connectedRooms) {
            if(room.getRoomName() === name) {
                return room;
            }
        }

        return null;
    }

    getEnemies() {
        return this.enemies;
    }

    setConnectedRooms(connectedRooms: Room[]) {
        this.connectedRooms = connectedRooms;
    }

    setDescription(description: string) {
        this.description = description;
    }

}