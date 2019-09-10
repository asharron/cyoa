import { Item } from './Item';
import { Weapon } from './Weapon';
import { WeaponManager } from './managers/WeaponManager';
import { Logger } from '../utils/Logger';
const weaponManager: WeaponManager = require('./managers/WeaponManager');
const logger: Logger = require('../utils/Logger');

export class Player {
    name: string;
    health: number;
    inventory: Item[];
    weapon: Weapon;

    constructor() {
        this.weapon = weaponManager.getWeaponByName("Sword");
        logger.log(JSON.stringify(this.weapon));
    }

    getWeaponName() {
        return this.weapon.getName();
    }

    getDamageAmount() {
        return this.weapon.getDamage();
    }
}

const player = new Player();
module.exports = player;