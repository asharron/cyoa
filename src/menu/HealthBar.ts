import blessed = require('blessed');

export class HealthBar {
    healthBar: blessed.Widgets.BoxElement;
    backgroundBar: blessed.Widgets.BoxElement;
    healthPercentage: blessed.Widgets.TextElement;

    constructor(mainScreen: blessed.Widgets.Screen) {
        this.backgroundBar = blessed.box({
            top: '0%',
            left: 'left',
            width: '20%',
            height: '5%',
            scrollable: true,
            content: "",
            style: {
                fg: 'black',
                bg: 'grey'
            }
        });

        this.healthBar = blessed.box({
            top: '0%',
            left: 'left',
            width: '20%',
            height: '5%',
            scrollable: true,
            content: "",
            style: {
                fg: 'black',
                bg: 'red'
            }
        });

        this.healthPercentage = blessed.text({
            top: '0%',
            left: '20%',
            width: '5%',
            height: '5%',
            scrollable: true,
            content: "100%",
            style: {
                fg: 'red',
                bg: 'black'
            }
        });

        mainScreen.append(this.backgroundBar);
        mainScreen.append(this.healthBar);
        mainScreen.append(this.healthPercentage);
    }
}