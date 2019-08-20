import blessed = require('blessed');

export class CommandWindow {

    commandBox: blessed.Widgets.TextboxElement;

    constructor(mainScreen: blessed.Widgets.Screen) {
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
                fg: 'white',
                bg: 'green',
                border: {
                    fg: 'green'
                },
            }
        });

        this.commandBox.on('submit', (e) => {
            console.log(e);
        });

        mainScreen.append(this.commandBox);
    }

    focus = () => {
        this.commandBox.focus();
    }
}