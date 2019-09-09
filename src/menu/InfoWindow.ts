import blessed = require('blessed');

export class InfoWindow {

    infoBox: blessed.Widgets.BoxElement;

    constructor(mainScreen: blessed.Widgets.Screen) {
        this.infoBox = blessed.box({
            top: '30%',
            left: 'center',
            width: '50%',
            height: '30%',
            scrollable: true,
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

        mainScreen.append(this.infoBox);
    }
}