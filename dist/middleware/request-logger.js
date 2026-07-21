"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = requestLogger;
function requestLogger(req, _res, next) {
    if (req.method === "OPTIONS") {
        return next();
    }
    // Lightweight access logging; swap for a structured logger if needed.
    // eslint-disable-next-line no-console
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
}
//# sourceMappingURL=request-logger.js.map