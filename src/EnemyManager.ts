import fs = require('fs');
import yaml = require('js-yaml');
import { Enemy } from './Enemy';
import { Logger } from './Logger';
const logger = require('./Logger');

interface EnemyDB {
    [key: string]: Enemy;
}

export class EnemyManager {
    enemyDB: EnemyDB;

    constructor() {
        this.readInEnemiesFile('enemies.yml');
    }

    readInEnemiesFile(filename: string) {
        let weaponsFile = fs.readFileSync(filename);
        let yamlString = weaponsFile.toString();
        this.enemyDB = yaml.safeLoad(yamlString);
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