import { Map } from './Map';
import { PlayerControls } from './controls/PlayerControls';
import { Menu } from './menu/Menu';
import { Logger } from './Logger';
import { Player } from './Player';
const logger: Logger = require('./Logger');
const weaponManager = require('./WeaponManager');
const player = require('./Player');

export class Engine {
    constructor() {
        let menu = new Menu();
        let playerControls = new PlayerControls();
        let map = new Map("rooms.yml");
    }
}