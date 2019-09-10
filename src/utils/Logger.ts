import fs = require('fs');

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