import { Item } from "./Item";

export class Weapon extends Item {
    damage: number;

    constructor(name: string, weight: number, damage: number) {
        super();
        this.name = name;
        this.weight = weight;
        this.damage = damage;
    }

    getName() {
        return this.name;
    }

    getDamage() {
        return this.damage;
    }
}