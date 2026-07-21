"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOsEnv = getOsEnv;
exports.getOsEnvOptional = getOsEnvOptional;
exports.toNumber = toNumber;
exports.toBool = toBool;
exports.normalizePort = normalizePort;
function getOsEnv(key) {
    if (typeof process.env[key] === 'undefined') {
        throw new Error(`Environment variable ${key} is not set.`);
    }
    return process.env[key];
}
function getOsEnvOptional(key) {
    return process.env[key];
}
function toNumber(value) {
    return parseInt(value || '0', 10);
}
function toBool(value) {
    return value === 'true';
}
function normalizePort(port) {
    const parsedPort = parseInt(port, 10);
    if (isNaN(parsedPort)) {
        return port;
    }
    if (parsedPort >= 0) {
        return parsedPort;
    }
    return false;
}
//# sourceMappingURL=index.js.map