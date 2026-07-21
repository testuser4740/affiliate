import 'reflect-metadata';
import { bootstrapMicroframework } from 'microframework-w3tec';
import { Logger } from './lib/logger';
import { winstonLoader } from './loaders/winstonLoader';
import { iocLoader } from './loaders/iocLoader';
import { typeormLoader } from './loaders/typeormLoader';
import { expressLoader } from './loaders/expressLoader';
import { homeLoader } from './loaders/homeLoader';
import { publicLoader } from './loaders/publicLoader';

const log = new Logger(__filename);

bootstrapMicroframework({
    loaders: [
        winstonLoader,
        iocLoader,
        typeormLoader,
        expressLoader,
        homeLoader,
        publicLoader,
    ],
})
    .then(() => log.info('Application bootstrap complete'))
    .catch((error) => log.error('Application crashed: ' + error));
