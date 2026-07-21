"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = Logger;
const typedi_1 = require("typedi");
const logger_1 = require("../lib/logger");
function Logger(scope) {
    return (target, propertyKey, index) => {
        const logger = new logger_1.Logger(scope);
        const propertyName = propertyKey ? propertyKey.toString() : '';
        typedi_1.Container.registerHandler({
            object: target,
            propertyName,
            index,
            value: () => logger,
        });
    };
}
//# sourceMappingURL=Logger.js.map