"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandlerMiddleware = void 0;
const tslib_1 = require("tslib");
const routing_controllers_1 = require("routing-controllers");
const class_validator_1 = require("class-validator");
const Logger_1 = require("../../decorators/Logger");
const env_1 = require("../../env");
const typedi_1 = require("typedi");
let ErrorHandlerMiddleware = class ErrorHandlerMiddleware {
    constructor(log) {
        this.log = log;
        this.isProduction = env_1.env.isProduction;
    }
    error(error, _req, res, _next) {
        const responseObject = {};
        if (error && Array.isArray(error.errors) && error.errors.every((e) => e instanceof class_validator_1.ValidationError)) {
            res.status(422);
            responseObject.status = 0;
            responseObject.message = 'Validation failed';
            responseObject.errors = error.errors.map((e) => ({
                field: e.property,
                constraints: e.constraints,
            }));
        }
        else {
            if (error instanceof routing_controllers_1.HttpError && error.httpCode) {
                res.status(error.httpCode);
            }
            else {
                res.status(500);
            }
            if (error instanceof Error) {
                responseObject.message = error.message;
                if (!this.isProduction && error.stack) {
                    responseObject.stack = error.stack;
                }
            }
            else if (typeof error === 'string') {
                responseObject.message = error;
            }
            responseObject.status = res.statusCode >= 400 ? 0 : 1;
        }
        this.log.error(error && error.name, error && error.message);
        res.json(responseObject);
    }
};
exports.ErrorHandlerMiddleware = ErrorHandlerMiddleware;
exports.ErrorHandlerMiddleware = ErrorHandlerMiddleware = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.Middleware)({ type: 'after' }),
    tslib_1.__param(0, (0, Logger_1.Logger)(__filename)),
    tslib_1.__metadata("design:paramtypes", [Object])
], ErrorHandlerMiddleware);
//# sourceMappingURL=ErrorHandlerMiddleware.js.map