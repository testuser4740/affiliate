"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const routing_controllers_1 = require("routing-controllers");
const config_1 = require("../config");
function errorHandler(err, _req, res, _next) {
    if (res.headersSent) {
        return;
    }
    if (err instanceof routing_controllers_1.HttpError) {
        const httpErr = err;
        const body = {
            success: false,
            error: err.message || "Error",
            status: err.httpCode,
        };
        if (httpErr.errors && (0, config_1.isDevelopment)()) {
            body.details = httpErr.errors;
        }
        res.status(err.httpCode).json(body);
        return;
    }
    const message = err instanceof Error ? err.message : "Internal server error";
    const status = err?.status ?? 500;
    res.status(status).json({ success: false, error: message });
}
//# sourceMappingURL=error-handler.js.map