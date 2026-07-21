"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogMiddleware = void 0;
const tslib_1 = require("tslib");
const routing_controllers_1 = require("routing-controllers");
const Logger_1 = require("../../decorators/Logger");
const typedi_1 = require("typedi");
let LogMiddleware = class LogMiddleware {
    constructor(log) {
        this.log = log;
    }
    use(req, _res, next) {
        this.log.info(`${req.method} ${req.originalUrl}`);
        next();
    }
};
exports.LogMiddleware = LogMiddleware;
exports.LogMiddleware = LogMiddleware = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.Middleware)({ type: 'before' }),
    tslib_1.__param(0, (0, Logger_1.Logger)(__filename)),
    tslib_1.__metadata("design:paramtypes", [Object])
], LogMiddleware);
//# sourceMappingURL=LogMiddleware.js.map