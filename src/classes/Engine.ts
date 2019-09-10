import { Map } from './map/Map';
import { PlayerControls } from '../controls/PlayerControls';
import { Menu } from '../menu/Menu';
import { Logger } from '../utils/Logger';
import { Player } from './Player';
const logger: Logger = require('../utils/Logger');
const weaponManager = require('./managers/WeaponManager');
const player = require('./Player');

export class Engine {
    constructor() {
        let menu = new Menu();
        let playerControls = new PlayerControls();
        let map = new Map("rooms.yml");
    }
}