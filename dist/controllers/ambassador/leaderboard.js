"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmbassadorLeaderboardController = void 0;
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const ambassadors_1 = require("../../entities/ambassadors");
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
__decorate([
    (0, typedi_1.Inject)(),
    __metadata("design:type", ambassador_service_1.AmbassadorService)
], AmbassadorLeaderboardController.prototype, "service", void 0);
__decorate([
    (0, routing_controllers_1.Get)("/leaderboard"),
    (0, routing_controllers_openapi_1.ResponseSchema)(ambassadors_1.Ambassador, { isArray: true }),
    __param(0, (0, routing_controllers_1.QueryParam)("state")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AmbassadorLeaderboardController.prototype, "leaderboard", null);
exports.AmbassadorLeaderboardController = AmbassadorLeaderboardController = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/ambassador")
], AmbassadorLeaderboardController);
//# sourceMappingURL=leaderboard.js.map