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
exports.AmbassadorTierController = void 0;
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const ambassador_service_1 = require("../../services/ambassador.service");
const tier_service_1 = require("../../services/tier.service");
let AmbassadorTierController = class AmbassadorTierController {
    /**
     * @openapi
     * /ambassador/{ambassadorId}/tier:
     *   get:
     *     tags: [Ambassador / Tier]
     *     summary: Own tier + progression to next tier
     */
    async tier(ambassadorId) {
        const ambassador = await this.ambassadors.getById(ambassadorId);
        const allTiers = await this.tiers.list();
        const { current, next, progressToNext } = this.tiers.resolveProgression(Number(ambassador.revenue ?? 0), allTiers);
        return {
            ambassador: {
                id: ambassador.id,
                name: ambassador.name,
                tier: ambassador.tier,
                revenue: ambassador.revenue,
                commissionPct: ambassador.commissionPct,
            },
            currentTier: current ?? null,
            nextTier: next ?? null,
            progressToNext,
            allTiers,
        };
    }
};
exports.AmbassadorTierController = AmbassadorTierController;
__decorate([
    (0, typedi_1.Inject)(),
    __metadata("design:type", ambassador_service_1.AmbassadorService)
], AmbassadorTierController.prototype, "ambassadors", void 0);
__decorate([
    (0, typedi_1.Inject)(),
    __metadata("design:type", tier_service_1.TierService)
], AmbassadorTierController.prototype, "tiers", void 0);
__decorate([
    (0, routing_controllers_1.Get)("/:ambassadorId/tier"),
    __param(0, (0, routing_controllers_1.Param)("ambassadorId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AmbassadorTierController.prototype, "tier", null);
exports.AmbassadorTierController = AmbassadorTierController = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/ambassador")
], AmbassadorTierController);
//# sourceMappingURL=tier.js.map