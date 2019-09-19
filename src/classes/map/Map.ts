import fs = require('fs');
import yaml = require('js-yaml');
import { Room } from '../Room';
import { EventBus } from '../../utils/EventBus';
import { MovementData } from '../../interfaces/MovementData';
import { Logger } from '../../utils/Logger';
import { Enemy } from '../Enemy';
import { EnemyManager } from '../managers/EnemyManager';
import { AttackData } from '../../interfaces/AttackData';
import { Player } from '../Player';
const eventBus: EventBus = require('../../utils/EventBus');
const logger: Logger = require('../../utils/Logger');
const enemyManager: EnemyManager = require('../managers/EnemyManager');
const player: Player = require('../Player');

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
        this.setupBusListeners();
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

    getEnemyByName(enemyName: string) {
        let enemies: Enemy[] = this.currentRoom.getEnemies();
        for(var enemy of enemies) {
            let name = enemy.getName();
            if(name === enemyName) {
                return enemy;
            }
        }
        return null;
    }

    setupBusListeners() {
        this.eventBus.onMapBus('move', this.handleMove);
        this.eventBus.onMapBus('look', this.handleLook);
        this.eventBus.onMapBus('attack', this.handleAttack);
    }

    handleMove = (moveInfo: MovementData) => {
        let nameToSearchFor = moveInfo.connectedRoomName;
        let roomToMoveTo: Room = this.currentRoom.getConnectedRoomByName(nameToSearchFor);

        if (roomToMoveTo) {
            this.moveToNewRoom(roomToMoveTo);
        } else {
            this.displayMissingRoomError();
        }
    }

    moveToNewRoom(roomToMoveTo: Room) {
        let roomInfo = "";
        this.currentRoom = roomToMoveTo;
        roomInfo += this.currentRoom.description;
        let roomEnemies: Enemy[] = this.currentRoom.getEnemies();
        if (roomEnemies.length > 0) {
            roomInfo += "\nShit! There are enemies in the room!\n";
            roomInfo += "The enemies are:";
            roomEnemies.forEach((enemy) => {
                let enemyName = enemy.getName();
                roomInfo += "\n " + enemyName;
            });
        }
        this.eventBus.emitOnMenuBus('updateInfo', roomInfo);
    }

    displayMissingRoomError() {
            logger.log("Did not find the next room.");
            let msg = "Sorry, that room is not connected";
            this.eventBus.emitOnMenuBus('updateInfo', msg);
    }

    handleLook = () => {
        let connectedRooms = this.currentRoom.getConnectedRoomNames();
        let msg = "You look around the room and see that you can move to: " + connectedRooms.join(", ");
        this.eventBus.emitOnMenuBus('updateInfo', msg);
    }

    handleAttack = (attackData: AttackData) => {
        let attackedEnemy = this.getEnemyByName(attackData.enemyName);
        let msg;

        if (attackedEnemy && attackedEnemy.isAlive()) {
            msg = this.calculateDamage(attackedEnemy, attackData);
        } else {
            logger.log("Could not find the enemy in the room " + attackData.enemyName);
            msg = `Sorry, that enemy is not in the room`;
        }
        this.eventBus.emitOnMenuBus('updateInfo', msg);
        
        this.enemyAttack(attackedEnemy);
    }

    calculateDamage(attackedEnemy: Enemy, attackData: AttackData) {
        let msg = `You swing at ${attackData.enemyName} with your ${attackData.weaponName} for ${attackData.damage} pts of damage`;
        attackedEnemy.takeDamage(attackData.damage);

        if (!attackedEnemy.isAlive()) {
            msg += `\nYou just slaughtered ${attackData.enemyName}!`;
        } else {
            msg += `\nOh shit! ${attackData.enemyName} is mad now!`;
        }
        return msg;
    }

    enemyAttack(enemy: Enemy) {
        let enemyAttackData = enemy.attack();
        logger.log("Here is the attack data: " + JSON.stringify(enemyAttackData))

        let msg = `${enemy.getName()} attacks you using ${enemyAttackData.move.name} for ${enemyAttackData.move.damage} pts of damage!`;
        player.takeDamage(enemyAttackData.move.damage);
        
        this.eventBus.emitOnMenuBus('updateInfo', msg);
    }
}