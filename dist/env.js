"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.open_api = exports.env = void 0;
const tslib_1 = require("tslib");
const dotenv = tslib_1.__importStar(require("dotenv"));
const path = tslib_1.__importStar(require("path"));
const env_1 = require("./lib/env");
dotenv.config({
    path: path.join(process.cwd(), `.env${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`),
});
exports.env = {
    node: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
    isDevelopment: process.env.NODE_ENV === 'development',
    app: {
        name: (0, env_1.getOsEnv)('APP_NAME'),
        host: (0, env_1.getOsEnv)('APP_HOST'),
        port: (0, env_1.normalizePort)(process.env.PORT || (0, env_1.getOsEnv)('APP_PORT')),
        routePrefix: (0, env_1.getOsEnv)('APP_ROUTE_PREFIX'),
        banner: (0, env_1.toBool)((0, env_1.getOsEnv)('APP_BANNER')),
    },
    log: {
        level: (0, env_1.getOsEnv)('LOG_LEVEL'),
        json: (0, env_1.toBool)((0, env_1.getOsEnvOptional)('LOG_JSON') || 'false'),
        output: (0, env_1.getOsEnv)('LOG_OUTPUT'),
    },
    db: {
        type: (0, env_1.getOsEnv)('TYPEORM_CONNECTION'),
        host: (0, env_1.getOsEnvOptional)('TYPEORM_HOST'),
        port: (0, env_1.toNumber)((0, env_1.getOsEnvOptional)('TYPEORM_PORT') || '5432'),
        username: (0, env_1.getOsEnvOptional)('TYPEORM_USERNAME'),
        password: (0, env_1.getOsEnvOptional)('TYPEORM_PASSWORD'),
        database: (0, env_1.getOsEnv)('TYPEORM_DATABASE'),
        synchronize: (0, env_1.toBool)((0, env_1.getOsEnvOptional)('TYPEORM_SYNCHRONIZE') || 'true'),
        logging: (0, env_1.toBool)((0, env_1.getOsEnv)('TYPEORM_LOGGING') || 'false'),
    },
};
exports.open_api = {
    OPEN_API_HOST: (0, env_1.getOsEnvOptional)('OPEN_API_HOST') || 'localhost',
    OPEN_API_PORT: (0, env_1.getOsEnvOptional)('OPEN_API_PORT') || '4000',
};
//# sourceMappingURL=env.js.map