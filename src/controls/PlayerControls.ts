import { EventEmitter } from 'events';
import { EventBus } from '../EventBus';
import { MovementData }  from '../MovementData';
import { Logger } from '../Logger';
import { Player } from '../Player';
import { AttackData } from '../AttackData';
const logger: Logger = require('../Logger');
const eventBus: EventBus = require('../EventBus');
const player: Player = require('../Player');

export class PlayerControls {
    eventEmitter: EventEmitter;
    eventBus: EventBus;

    constructor() {
        this.eventBus = eventBus;

        this.setupListeners();
    }

    setupListeners() {
        this.eventBus.onControlsBus('command', (command: string) => {
            this.processCommand(command);
        });
    }

    processCommand(command: string) {
        let commandType = this.getCommandType(command);
        
        switch(commandType) {
            case "move":
                let roomToMoveTo = this.extractRoomName(command);
                let movementData = this.createMovementData(roomToMoveTo);
                this.eventBus.emitOnMapBus('move', movementData);
                break;
            case "look":
                this.eventBus.emitOnMapBus('look', '');
                break;
            case "attack":
                let attackData = this.createAttackData(command);
                this.eventBus.emitOnMapBus('attack', attackData);
                break;
            default:
                this.eventBus.emitOnMenuBus('updateInfo', 'That command is not available');
                break;
        }
    }

    getCommandType(command: string) {
        let splitCommands = command.split(' ');
        return splitCommands[0];
    }

    extractRoomName(command: string) {
        let splitCommands = command.split(' ');
        let roomName = splitCommands.slice(1).join(' ');
        return roomName;
    }

    extractEnemyName(command: string) {
        let splitCommands = command.split(' ');
        let enemyName = splitCommands.slice(1).join(' ');
        return enemyName;
    }

    splitCommand(command: string) {
        return command.split(' ');
    }

    createMovementData(roomToMoveToName: string) {
        let movementData: MovementData;
        movementData = {
            connectedRoomName: roomToMoveToName
        };
        return movementData;
    }

    createAttackData(command: string) {
        let enemyName = this.extractEnemyName(command);
        let weaponName = player.getWeaponName();
        let weaponDamage = player.getDamageAmount();

        let attackData: AttackData = {
            damage: weaponDamage,
            weaponName: weaponName,
            enemyName: enemyName
        }
        return attackData;
    }
}