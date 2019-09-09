import blessed = require('blessed');

export class InfoWindow {

    infoBox: blessed.Widgets.BoxElement;

    constructor(mainScreen: blessed.Widgets.Screen) {
        this.infoBox = blessed.box({
            top: '30%',
            left: 'center',
            width: '50%',
            height: '50%',
            scrollable: true,
            alwaysScroll: true,
            scrollbar: {
                ch: ' ',
                track: true
            },
            border: {
                type: 'line'
            },
            style: {
                fg: 'black',
                bg: 'green',
                border: {
                    fg: 'green'
                },
                scrollbar: {
                    fg: 'red',
                    bg: 'red'
                }
            }
        });

        mainScreen.append(this.infoBox);
    }

    scrollToContent() {
        this.infoBox.scroll(100);
    }
}