import { Weapon } from "./Weapon";

export class Enemy {
    name: string;
    weapon: Weapon;
    hitpoints: number;
    alive: boolean;

    constructor() {
        this.alive = true;
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