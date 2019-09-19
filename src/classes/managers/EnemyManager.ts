import fs = require('fs');
import yaml = require('js-yaml');
import { Enemy } from '../Enemy';
import { Logger } from '../../utils/Logger';
import { WeaponManager } from './WeaponManager'
import { Move } from '../Move';
const logger: Logger = require('../../utils/Logger');
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
        let enemyDataKeys = Object.keys(enemyData);

        enemyDataKeys.forEach((key: string) => {
            let name = enemyData[key].name;
            let weaponName = enemyData[key].weapon;
            let weapon = weaponManager.getWeaponByName(weaponName);
            let hitpoints = enemyData[key].hitpoints;
            //This is an array of [{'Sword: {}}, { 'growl': {}}]
            //I want just the inner object [{}, {}];
            let moves: Move[] = [];
            enemyData[key].moves.forEach((move: any) => {
                Object.keys(move).forEach(key => {
                    moves.push(move[key]);
                })
            });

            let enemy = new Enemy(name, weapon, hitpoints, moves);
            this.enemyDB[key] = enemy;
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