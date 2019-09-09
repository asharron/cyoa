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
        this.weaponsDB = {};
        this.readInWeaponsFile('weapons.yml');
    }

    readInWeaponsFile(filename: string) {
        let weaponsFile = fs.readFileSync(filename);
        let yamlString = weaponsFile.toString();
        let weaponsData = yaml.safeLoad(yamlString);
        this.createWeaponsDB(weaponsData);
    }

    createWeaponsDB(weaponsData: any) {
        Object.keys(weaponsData).forEach((key: string) => {
            let name = weaponsData[key].name;
            let weight = weaponsData[key].weight;
            let damage = weaponsData[key].damage;

            let weapon = new Weapon(name, weight, damage);
            this.weaponsDB[key] = weapon;
        });
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