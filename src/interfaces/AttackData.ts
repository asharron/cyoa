import { Move } from "../classes/Move";

export interface AttackData {
    damage: number;
    weaponName?: string;
    enemyName?: string;
    move?: Move;
}