import blessed = require('blessed');
import { CommandWindow } from './CommandWindow';
import { InfoWindow } from './InfoWindow';
import { PlayerControls } from '../controls/PlayerControls';
import { EventBus } from '../EventBus';
import { Logger } from '../Logger';
const shutdown = require('../Shutdown');
const eventBus: EventBus = require('../EventBus');
const logger: Logger = require('../Logger');


export class Menu {
    width: number;
    height: number;
    mainScreen: blessed.Widgets.Screen;
    commandWindow: CommandWindow;
    infoWindow: InfoWindow;
    eventBus: EventBus;

    constructor() {
        this.eventBus = eventBus;

        this.mainScreen = blessed.screen({
            smartCSR: true
        });
        this.mainScreen.title = "Big Project";
        this.createSubWindows();
        this.setupKeyCommands();
        this.drawMenu();

        this.eventBus.onMenuBus('updateInfo', (data: any) => {
            this.infoWindow.infoBox.content = this.infoWindow.infoBox.content + data + "\n";
            this.drawMenu();
        });
    }

    createSubWindows = () => {
        this.commandWindow = new CommandWindow(this);
        this.infoWindow = new InfoWindow(this.mainScreen);
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

}