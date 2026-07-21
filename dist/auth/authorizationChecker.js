"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizationChecker = authorizationChecker;
exports.currentUserChecker = currentUserChecker;
function authorizationChecker(_connection) {
    return (action, roles) => {
        const user = action.request.user;
        if (!user) {
            return false;
        }
        if (roles && roles.length > 0) {
            return roles.includes(user.role);
        }
        return true;
    };
}
function currentUserChecker(_connection) {
    return (action) => action.request.user;
}
//# sourceMappingURL=authorizationChecker.js.map