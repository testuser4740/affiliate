import { configure, format, transports, Logger as WinstonLogger, createLogger } from 'winston';
import { env } from '../../env';

const { combine, colorize, simple, json } = format;

const logger = createLogger({
    level: env.log.level,
    transports: [
        new transports.Console({
            handleExceptions: true,
            format:
                env.node !== 'development'
                    ? combine(json())
                    : combine(colorize(), simple()),
        }),
    ],
});

export class Logger {
    private readonly scope: string;

    constructor(scope: string) {
        this.scope = scope;
    }

    public debug(message: string, ...args: any[]): void {
        logger.debug(`[${this.scope}] ${message}`, ...args);
    }

    public info(message: string, ...args: any[]): void {
        logger.info(`[${this.scope}] ${message}`, ...args);
    }

    public warn(message: string, ...args: any[]): void {
        logger.warn(`[${this.scope}] ${message}`, ...args);
    }

    public error(message: string, ...args: any[]): void {
        logger.error(`[${this.scope}] ${message}`, ...args);
    }
}

export interface LoggerInterface {
    debug(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
}
