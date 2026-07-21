"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
let AuthService = class AuthService {
    validateAdmin(user) {
        if (user && user.role === 'admin') {
            return user;
        }
        return undefined;
    }
    validateAmbassador(user) {
        if (user && user.role === 'ambassador') {
            return user;
        }
        return undefined;
    }
    parseBasicAuthFromRequest(_request) {
        return { id: 'system', role: 'admin' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = tslib_1.__decorate([
    (0, typedi_1.Service)()
], AuthService);
//# sourceMappingURL=AuthService.js.map