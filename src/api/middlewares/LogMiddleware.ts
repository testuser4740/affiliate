import * as express from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Service } from 'typedi';

@Service()
@Middleware({ type: 'before' })
export class LogMiddleware implements ExpressMiddlewareInterface {
    constructor(
        @Logger(__filename) private log: LoggerInterface,
    ) { }

    public use(req: express.Request, _res: express.Response, next: (err?: any) => any): void {
        this.log.info(`${req.method} ${req.originalUrl}`);
        next();
    }
}
