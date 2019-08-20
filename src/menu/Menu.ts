import blessed = require('blessed');
import { CommandWindow } from './CommandWindow';


export class Menu {
    width: number;
    height: number;
    mainScreen: blessed.Widgets.Screen;
    commandWindow: CommandWindow;

    constructor() {
        this.mainScreen = blessed.screen({
            smartCSR: true
        });
        this.mainScreen.title = "Your listening to Big Bois Neighborhood";
        this.createCommandWindow();
        this.setupKeyCommands();
        this.drawMenu();
    }

    createCommandWindow = () => {
        this.commandWindow = new CommandWindow(this.mainScreen);
    }

    setupKeyCommands = () => {
        this.mainScreen.key(['escape', 'q', 'C-c'], function (ch, key) {
            return process.exit(0);
        });

        this.mainScreen.key(['i'], (ch, key) => {
            return this.commandWindow.focus();
        });
    }

    drawMenu() {
        this.mainScreen.render();
    }

}