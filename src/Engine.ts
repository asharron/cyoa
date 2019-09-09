import { Map } from './Map';
import { PlayerControls } from './controls/PlayerControls';
import { Menu } from './menu/Menu';
import { Logger } from './Logger';
const logger: Logger = require('./Logger');

export class Engine {
    constructor() {
        let menu = new Menu();
        let playerControls = new PlayerControls();
        let map = new Map("rooms.yml");
    }
}