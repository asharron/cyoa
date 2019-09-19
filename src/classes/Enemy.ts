import { Weapon } from "./Weapon";
import { Move } from "./Move";
import { AttackData } from "../interfaces/AttackData";
import { Logger } from "../utils/Logger";
const logger: Logger = require('../utils/Logger');

export class Enemy {
    name: string;
    weapon: Weapon;
    hitpoints: number;
    alive: boolean;
    moves: Move[];


    constructor(name: string, weapon: Weapon, hitpoints: number, moves: Move[]) {
        this.name = name;
        this.weapon = weapon;
        this.hitpoints = hitpoints;
        this.alive = true;
        this.moves = moves;
    }

    getName() {
        return this.name;
    }

    takeDamage(damage: number) {
        this.hitpoints = this.hitpoints - damage;

        if(this.hitpoints <= 0) {
            this.alive = false;
        }
    }

    isAlive() {
        return this.alive;
    }

    attack() {
        let move = this.chooseMove();

        let attackData: AttackData = {
            damage: move.damage,
            enemyName: "self",
            move: move
        };

        return attackData;
    }

    chooseMove() {
        let randomNumber = Math.random();
        logger.log("Moves are: " + JSON.stringify(this.moves));

        for(let move of this.moves) {
            let calculationOfChoice = randomNumber * move.chance;
            if(calculationOfChoice > move.chance) {
                return move;
            }
        }

        return this.moves[0];
    }
}