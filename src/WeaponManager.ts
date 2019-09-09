import fs = require('fs');
import yaml = require('js-yaml');
import { Weapon } from './Weapon';
const logger = require('./Logger');

interface WeaponDB {
    [key: string]: Weapon;
}

export class WeaponManager {

    weaponsDB: WeaponDB;

    constructor() {
        this.readInWeaponsFile('weapons.yml');
    }

    readInWeaponsFile(filename: string) {
        let weaponsFile = fs.readFileSync(filename);
        let yamlString = weaponsFile.toString();
        this.weaponsDB = yaml.safeLoad(yamlString);
    }

    getWeaponByName(weaponName: string) {
        let weapon = this.weaponsDB[weaponName];
        if(weapon) {
            return weapon;
        }
        logger.log("Could not find weapon: " + weaponName);
        return null;
    }
}

const weaponManager = new WeaponManager();
module.exports = weaponManager;