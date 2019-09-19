import blessed = require('blessed');

export class LogWindow {
    logBox: blessed.Widgets.BoxElement;

    constructor(mainScreen: blessed.Widgets.Screen) {
        this.logBox = blessed.box({
            top: '30%',
            left: 'left',
            width: '25%',
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
                fg: 'white',
                bg: 'black',
                border: {
                    fg: 'white'
                },
                scrollbar: {
                    fg: 'red',
                    bg: 'red'
                }
            }
        });

        mainScreen.append(this.logBox);
    }

    addContent(msg: string) {
        this.logBox.content = this.logBox.content + msg + "\n";
    }

    scrollToContent() {
        this.logBox.scroll(100);
    }
}