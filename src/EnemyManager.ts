import fs = require('fs');
import yaml = require('js-yaml');
import { Enemy } from './Enemy';
import { Logger } from './Logger';
import { WeaponManager } from './WeaponManager'
const logger: Logger = require('./Logger');
const weaponManager: WeaponManager = require('./WeaponManager');

interface EnemyDB {
    [key: string]: Enemy;
}

export class EnemyManager {
    enemyDB: EnemyDB;

    constructor() {
        this.enemyDB = {};
        this.readInEnemiesFile('enemies.yml');
    }

    readInEnemiesFile(filename: string) {
        let weaponsFile = fs.readFileSync(filename);
        let yamlString = weaponsFile.toString();
        let enemyData = yaml.safeLoad(yamlString);
        this.createEnemiesDB(enemyData);
    }

    createEnemiesDB(enemyData: any) {
        let enemyList: Enemy[] = [];

        Object.keys(enemyData).forEach((key: string) => {
            let name = enemyData[key].name;
            let weaponName = enemyData[key].weapon;
            let weapon = weaponManager.getWeaponByName(weaponName);
            let hitpoints = enemyData[key].hitpoints;

            let enemy = new Enemy(name, weapon, hitpoints);
            this.enemyDB[key] = enemy;
            enemyList.push(enemy);
        });
    }

    getEnemyByName(enemyName: string) {
        let enemy = this.enemyDB[enemyName];
        if(enemy) {
            return enemy;
        }

        logger.log("Could not find enemy: " + enemyName);
        return null;
    }
}

const enemyManager = new EnemyManager();
module.exports = enemyManager;