"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmbassadorTierController = void 0;
const tslib_1 = require("tslib");
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
tslib_1.__decorate([
    (0, typedi_1.Inject)(),
    tslib_1.__metadata("design:type", ambassador_service_1.AmbassadorService)
], AmbassadorTierController.prototype, "ambassadors", void 0);
tslib_1.__decorate([
    (0, typedi_1.Inject)(),
    tslib_1.__metadata("design:type", tier_service_1.TierService)
], AmbassadorTierController.prototype, "tiers", void 0);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)("/:ambassadorId/tier"),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("ambassadorId")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AmbassadorTierController.prototype, "tier", null);
exports.AmbassadorTierController = AmbassadorTierController = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/ambassador")
], AmbassadorTierController);
//# sourceMappingURL=TierController.js.map