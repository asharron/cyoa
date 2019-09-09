import blessed = require('blessed');
import { Menu } from './Menu';

export class CommandWindow {

    commandBox: blessed.Widgets.TextboxElement;
    menu: Menu;

    constructor(menu: Menu) {
        this.menu = menu;

        this.initalizeWindow();
        this.setupControlCallbacks();
    }

    initalizeWindow() {
        let mainScreen = this.menu.getScreen();

        this.commandBox = blessed.textbox({
            top: '85%',
            left: 'center',
            width: '50%',
            height: '15%',
            inputOnFocus: true,
            tags: true,
            border: {
                type: 'line'
            },
            style: {
                fg: 'black',
                bg: 'green',
                border: {
                    fg: 'green'
                },
            }
        });
        
        mainScreen.append(this.commandBox);
    }

    setupControlCallbacks() {
        this.commandBox.on('submit', (e) => {
            this.menu.passCommandToControls(e);
            this.commandBox.clearValue();
            this.commandBox.focus();
            let mainScreen = this.menu.getScreen();
            mainScreen.render();
        });
    }

    focus = () => {
        this.commandBox.focus();
    }
}