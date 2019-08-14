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

    setConnectedRooms(connectedRooms: Room[]) {
        this.connectedRooms = connectedRooms;
    }

    setDescription(description: string) {
        this.description = description;
    }

}