"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = exports.UnauthorizedError = exports.ConflictError = exports.ValidationError = exports.NotFoundError = void 0;
const routing_controllers_1 = require("routing-controllers");
class NotFoundError extends routing_controllers_1.HttpError {
    constructor(message = "Resource not found") {
        super(404, message);
        this.name = "NotFoundError";
    }
}
exports.NotFoundError = NotFoundError;
class ValidationError extends routing_controllers_1.HttpError {
    constructor(message = "Validation failed") {
        super(422, message);
        this.name = "ValidationError";
    }
}
exports.ValidationError = ValidationError;
class ConflictError extends routing_controllers_1.HttpError {
    constructor(message = "Conflict") {
        super(409, message);
        this.name = "ConflictError";
    }
}
exports.ConflictError = ConflictError;
class UnauthorizedError extends routing_controllers_1.HttpError {
    constructor(message = "Unauthorized") {
        super(401, message);
        this.name = "UnauthorizedError";
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends routing_controllers_1.HttpError {
    constructor(message = "Forbidden") {
        super(403, message);
        this.name = "ForbiddenError";
    }
}
exports.ForbiddenError = ForbiddenError;
//# sourceMappingURL=index.js.map