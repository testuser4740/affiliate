"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iocLoader = exports.getConnection = void 0;
const class_validator_1 = require("class-validator");
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const typeormLoader_1 = require("./typeormLoader");
Object.defineProperty(exports, "getConnection", { enumerable: true, get: function () { return typeormLoader_1.getConnection; } });
const iocLoader = () => {
    (0, routing_controllers_1.useContainer)(typedi_1.Container);
    (0, class_validator_1.useContainer)(typedi_1.Container, {
        fallback: true,
        fallbackOnErrors: true,
    });
};
exports.iocLoader = iocLoader;
//# sourceMappingURL=iocLoader.js.map