"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmbassadorPayoutController = void 0;
const tslib_1 = require("tslib");
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const payouts_1 = require("../../models/payouts");
const payout_service_1 = require("../../services/payout.service");
let AmbassadorPayoutController = class AmbassadorPayoutController {
    /**
     * @openapi
     * /ambassador/{ambassadorId}/payouts:
     *   get:
     *     tags: [Ambassador / Payouts]
     *     summary: Own payout cycles
     */
    async payouts(ambassadorId, month) {
        return this.service.list(ambassadorId, month);
    }
};
exports.AmbassadorPayoutController = AmbassadorPayoutController;
tslib_1.__decorate([
    (0, typedi_1.Inject)(),
    tslib_1.__metadata("design:type", payout_service_1.PayoutService)
], AmbassadorPayoutController.prototype, "service", void 0);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)("/:ambassadorId/payouts"),
    (0, routing_controllers_openapi_1.ResponseSchema)(payouts_1.Payout, { isArray: true }),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("ambassadorId")),
    tslib_1.__param(1, (0, routing_controllers_1.QueryParam)("month")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], AmbassadorPayoutController.prototype, "payouts", null);
exports.AmbassadorPayoutController = AmbassadorPayoutController = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/ambassador")
], AmbassadorPayoutController);
//# sourceMappingURL=PayoutsController.js.map