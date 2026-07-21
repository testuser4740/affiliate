"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = exports.errorHandler = exports.isDevelopment = exports.isProduction = exports.config = void 0;
var config_1 = require("./config");
Object.defineProperty(exports, "config", { enumerable: true, get: function () { return config_1.config; } });
Object.defineProperty(exports, "isProduction", { enumerable: true, get: function () { return config_1.isProduction; } });
Object.defineProperty(exports, "isDevelopment", { enumerable: true, get: function () { return config_1.isDevelopment; } });
__exportStar(require("./exceptions"), exports);
var error_handler_1 = require("./middleware/error-handler");
Object.defineProperty(exports, "errorHandler", { enumerable: true, get: function () { return error_handler_1.errorHandler; } });
var request_logger_1 = require("./middleware/request-logger");
Object.defineProperty(exports, "requestLogger", { enumerable: true, get: function () { return request_logger_1.requestLogger; } });
//# sourceMappingURL=common.js.map