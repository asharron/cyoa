import fs = require('fs');
import { EventBus } from './EventBus';
const eventBus: EventBus = require('./EventBus');

export class Logger {

    logFile: any;

    constructor() {
        this.createAndOpenLogFile();
    }

    createAndOpenLogFile() {
        if(!fs.existsSync('./logs')) {
            fs.mkdirSync('./logs');
        }
        let fileHandle = fs.openSync("./logs/logs", "w");
        this.logFile = fileHandle;
    }

    log(msg: string) {
        fs.writeSync(this.logFile, msg + "\n");
        eventBus.emitOnMenuBus('log', msg);
    }

    close() {
        return new Promise((res, rej) => {
            fs.close(this.logFile, () => {
                return res();
            });
        });
    }
}

const logger = new Logger();
module.exports = logger;