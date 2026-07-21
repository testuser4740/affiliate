"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.NotFoundError = exports.getRepo = void 0;
const data_source_1 = require("../data-source");
const getRepo = (target) => data_source_1.AppDataSource.getRepository(target);
exports.getRepo = getRepo;
class NotFoundError extends Error {
    constructor(message = "Resource not found") {
        super(message);
        this.status = 404;
        this.name = "NotFoundError";
    }
}
exports.NotFoundError = NotFoundError;
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.status = 422;
        this.name = "ValidationError";
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=base.js.map