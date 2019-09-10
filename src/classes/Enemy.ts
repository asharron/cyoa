import { Weapon } from "./Weapon";

export class Enemy {
    name: string;
    weapon: Weapon;
    hitpoints: number;
    alive: boolean;

    constructor(name: string, weapon: Weapon, hitpoints: number) {
        this.name = name;
        this.weapon = weapon;
        this.hitpoints = hitpoints;
        this.alive = true;
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
}