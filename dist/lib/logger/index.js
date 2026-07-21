"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const winston_1 = require("winston");
const env_1 = require("../../env");
const { combine, colorize, simple, json } = winston_1.format;
const logger = (0, winston_1.createLogger)({
    level: env_1.env.log.level,
    transports: [
        new winston_1.transports.Console({
            handleExceptions: true,
            format: env_1.env.node !== 'development'
                ? combine(json())
                : combine(colorize(), simple()),
        }),
    ],
});
class Logger {
    constructor(scope) {
        this.scope = scope;
    }
    debug(message, ...args) {
        logger.debug(`[${this.scope}] ${message}`, ...args);
    }
    info(message, ...args) {
        logger.info(`[${this.scope}] ${message}`, ...args);
    }
    warn(message, ...args) {
        logger.warn(`[${this.scope}] ${message}`, ...args);
    }
    error(message, ...args) {
        logger.error(`[${this.scope}] ${message}`, ...args);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=index.js.map