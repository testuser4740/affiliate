"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const microframework_w3tec_1 = require("microframework-w3tec");
const logger_1 = require("./lib/logger");
const winstonLoader_1 = require("./loaders/winstonLoader");
const iocLoader_1 = require("./loaders/iocLoader");
const typeormLoader_1 = require("./loaders/typeormLoader");
const expressLoader_1 = require("./loaders/expressLoader");
const homeLoader_1 = require("./loaders/homeLoader");
const publicLoader_1 = require("./loaders/publicLoader");
const log = new logger_1.Logger(__filename);
(0, microframework_w3tec_1.bootstrapMicroframework)({
    loaders: [
        winstonLoader_1.winstonLoader,
        iocLoader_1.iocLoader,
        typeormLoader_1.typeormLoader,
        expressLoader_1.expressLoader,
        homeLoader_1.homeLoader,
        publicLoader_1.publicLoader,
    ],
})
    .then(() => log.info('Application bootstrap complete'))
    .catch((error) => log.error('Application crashed: ' + error));
//# sourceMappingURL=app.js.map