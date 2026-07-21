import * as dotenv from 'dotenv';
import * as path from 'path';

import {
    getOsEnv,
    getOsEnvOptional,
    normalizePort,
    toBool,
    toNumber,
} from './lib/env';

dotenv.config({
    path: path.join(process.cwd(), `.env${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`),
});

export const env = {
    node: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
    isDevelopment: process.env.NODE_ENV === 'development',
    app: {
        name: getOsEnv('APP_NAME'),
        host: getOsEnv('APP_HOST'),
        port: normalizePort(process.env.PORT || getOsEnv('APP_PORT')),
        routePrefix: getOsEnv('APP_ROUTE_PREFIX'),
        banner: toBool(getOsEnv('APP_BANNER')),
    },
    log: {
        level: getOsEnv('LOG_LEVEL'),
        json: toBool(getOsEnvOptional('LOG_JSON') || 'false'),
        output: getOsEnv('LOG_OUTPUT'),
    },
    db: {
        type: getOsEnv('TYPEORM_CONNECTION'),
        host: getOsEnvOptional('TYPEORM_HOST'),
        port: toNumber(getOsEnvOptional('TYPEORM_PORT') || '5432'),
        username: getOsEnvOptional('TYPEORM_USERNAME'),
        password: getOsEnvOptional('TYPEORM_PASSWORD'),
        database: getOsEnv('TYPEORM_DATABASE'),
        synchronize: toBool(getOsEnvOptional('TYPEORM_SYNCHRONIZE') || 'true'),
        logging: toBool(getOsEnv('TYPEORM_LOGGING') || 'false'),
    },
};

export const open_api = {
    OPEN_API_HOST: getOsEnvOptional('OPEN_API_HOST') || 'localhost',
    OPEN_API_PORT: getOsEnvOptional('OPEN_API_PORT') || '4000',
};
