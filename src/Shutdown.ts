import { Logger } from './Logger';
const logger: Logger = require('./Logger');

function shutdown() {
    return new Promise((res) => {
        logger.close().then(() => {
            return res();
        });
    });
}

module.exports = shutdown;