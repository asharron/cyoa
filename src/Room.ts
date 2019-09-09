export class Room {
    name: string;
    description: string;
    connectedRoomNames: string[];
    connectedRooms: Room[];

    constructor(name: string, description: string, connectedRoomNames: string[]) {
        this.name = name;
        this.description = description;
        this.connectedRoomNames = connectedRoomNames;
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

    setConnectedRooms(connectedRooms: Room[]) {
        this.connectedRooms = connectedRooms;
    }

    setDescription(description: string) {
        this.description = description;
    }

}