import blessed = require('blessed');
import { CommandWindow } from './CommandWindow';
import { InfoWindow } from './InfoWindow';
import { PlayerControls } from '../controls/PlayerControls';
import { EventBus } from '../utils/EventBus';
import { Logger } from '../utils/Logger';
import { HealthBar } from './healthbar';
import { LogWindow } from './LogWindow';
const shutdown = require('../Shutdown');
const eventBus: EventBus = require('../utils/EventBus');
const logger: Logger = require('../utils/Logger');


export class Menu {
    width: number;
    height: number;
    mainScreen: blessed.Widgets.Screen;
    commandWindow: CommandWindow;
    infoWindow: InfoWindow;
    healthBar: HealthBar;
    eventBus: EventBus;
    logWindow: LogWindow;

    constructor() {
        this.eventBus = eventBus;

        this.mainScreen = blessed.screen({
            smartCSR: true
        });
        this.mainScreen.title = "Big Project";
        this.createSubWindows();
        this.setupKeyCommands();
        this.drawMenu();

        this.setupEventBusListeners();
    }

    createSubWindows = () => {
        this.commandWindow = new CommandWindow(this);
        this.infoWindow = new InfoWindow(this.mainScreen);
        this.healthBar = new HealthBar(this.mainScreen);
        this.logWindow = new LogWindow(this.mainScreen);
    }

    setupKeyCommands = () => {
        this.mainScreen.key(['escape', 'q', 'C-c'], function (ch, key) {
            shutdown().then(() => {
                process.exit(0);
            });
        });

        this.mainScreen.key(['i'], (ch, key) => {
            return this.commandWindow.focus();
        });
    }

    drawMenu() {
        this.mainScreen.render();
    }

    getScreen() {
        return this.mainScreen;
    }

    passCommandToControls(command: string) {
        this.eventBus.emitOnControlsBus("command", command);
    }

    setupEventBusListeners() {
        this.eventBus.onMenuBus('updateInfo', this.handleUpdateInfo);
        this.eventBus.onMenuBus('log', this.handleLogUpdate);
    }

    handleUpdateInfo = (msg: string) => {
            this.infoWindow.addContent(msg);
            this.infoWindow.scrollToContent();
            this.drawMenu();
    }

    handleLogUpdate = (msg: string) => {
        this.logWindow.addContent(msg);
        this.logWindow.scrollToContent();
        this.drawMenu();
    }

}