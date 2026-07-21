"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUserChecker = exports.authorizationChecker = exports.appContainer = void 0;
require("reflect-metadata");
const typedi_1 = require("typedi");
const routing_controllers_1 = require("routing-controllers");
exports.appContainer = typedi_1.Container;
// Wire routing-controllers DI to TypeDI
(0, routing_controllers_1.useContainer)(typedi_1.Container);
// (Optional) central place for auth checks; currently open for admin tooling.
const authorizationChecker = (_action) => true;
exports.authorizationChecker = authorizationChecker;
const currentUserChecker = (_action) => undefined;
exports.currentUserChecker = currentUserChecker;
//# sourceMappingURL=container.js.map