import * as express from 'express';
import { ExpressErrorMiddlewareInterface, HttpError, Middleware } from 'routing-controllers';
import { ValidationError } from 'class-validator';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { env } from '../../env';
import { Service } from 'typedi';

@Service()
@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
    public isProduction = env.isProduction;

    constructor(
        @Logger(__filename) private log: LoggerInterface,
    ) { }

    public error(error: any, _req: express.Request, res: express.Response, _next: express.NextFunction): void {
        const responseObject: any = {};

        if (error && Array.isArray(error.errors) && error.errors.every((e: any) => e instanceof ValidationError)) {
            res.status(422);
            responseObject.status = 0;
            responseObject.message = 'Validation failed';
            responseObject.errors = error.errors.map((e: ValidationError) => ({
                field: e.property,
                constraints: e.constraints,
            }));
        } else {
            if (error instanceof HttpError && error.httpCode) {
                res.status(error.httpCode);
            } else {
                res.status(500);
            }

            if (error instanceof Error) {
                responseObject.message = error.message;
                if (!this.isProduction && error.stack) {
                    responseObject.stack = error.stack;
                }
            } else if (typeof error === 'string') {
                responseObject.message = error;
            }
            responseObject.status = res.statusCode >= 400 ? 0 : 1;
        }

        this.log.error(error && error.name, error && error.message);
        res.json(responseObject);
    }
}
