"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmbassadorLeaderboardController = void 0;
const tslib_1 = require("tslib");
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const ambassadors_1 = require("../../models/ambassadors");
const ambassador_service_1 = require("../../services/ambassador.service");
let AmbassadorLeaderboardController = class AmbassadorLeaderboardController {
    /**
     * @openapi
     * /ambassador/leaderboard:
     *   get:
     *     tags: [Ambassador / Leaderboard]
     *     summary: Public leaderboard (revenue ranking)
     */
    async leaderboard(state) {
        return this.service.publicLeaderboard(state);
    }
};
exports.AmbassadorLeaderboardController = AmbassadorLeaderboardController;
tslib_1.__decorate([
    (0, typedi_1.Inject)(),
    tslib_1.__metadata("design:type", ambassador_service_1.AmbassadorService)
], AmbassadorLeaderboardController.prototype, "service", void 0);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)("/leaderboard"),
    (0, routing_controllers_openapi_1.ResponseSchema)(ambassadors_1.Ambassador, { isArray: true }),
    tslib_1.__param(0, (0, routing_controllers_1.QueryParam)("state")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AmbassadorLeaderboardController.prototype, "leaderboard", null);
exports.AmbassadorLeaderboardController = AmbassadorLeaderboardController = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/ambassador")
], AmbassadorLeaderboardController);
//# sourceMappingURL=LeaderboardController.js.map