"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmbassadorHomeController = void 0;
const tslib_1 = require("tslib");
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const ambassadors_1 = require("../../models/ambassadors");
const dashboard_service_1 = require("../../services/dashboard.service");
const ambassador_service_1 = require("../../services/ambassador.service");
const ambassador_dto_1 = require("../../../dto/ambassador.dto");
let AmbassadorHomeController = class AmbassadorHomeController {
    /**
     * @openapi
     * /ambassador/{ambassadorId}/home:
     *   get:
     *     tags: [Ambassador / Home]
     *     summary: Own dashboard — profile, KPIs, URLs and recent orders
     */
    async home(ambassadorId) {
        return this.dashboard.home(ambassadorId);
    }
    /**
     * @openapi
     * /ambassador/{ambassadorId}/profile:
     *   get:
     *     tags: [Ambassador / Home]
     *     summary: Get own profile
     */
    async profile(ambassadorId) {
        return this.ambassadors.getById(ambassadorId);
    }
    async updateProfile(ambassadorId, body) {
        return this.ambassadors.update(ambassadorId, body);
    }
};
exports.AmbassadorHomeController = AmbassadorHomeController;
tslib_1.__decorate([
    (0, typedi_1.Inject)(),
    tslib_1.__metadata("design:type", dashboard_service_1.DashboardService)
], AmbassadorHomeController.prototype, "dashboard", void 0);
tslib_1.__decorate([
    (0, typedi_1.Inject)(),
    tslib_1.__metadata("design:type", ambassador_service_1.AmbassadorService)
], AmbassadorHomeController.prototype, "ambassadors", void 0);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)("/:ambassadorId/home"),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("ambassadorId")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AmbassadorHomeController.prototype, "home", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)("/:ambassadorId/profile"),
    (0, routing_controllers_openapi_1.ResponseSchema)(ambassadors_1.Ambassador),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("ambassadorId")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AmbassadorHomeController.prototype, "profile", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Put)("/:ambassadorId/profile"),
    (0, routing_controllers_openapi_1.ResponseSchema)(ambassadors_1.Ambassador),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("ambassadorId")),
    tslib_1.__param(1, (0, routing_controllers_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, ambassador_dto_1.UpdateAmbassadorInput]),
    tslib_1.__metadata("design:returntype", Promise)
], AmbassadorHomeController.prototype, "updateProfile", null);
exports.AmbassadorHomeController = AmbassadorHomeController = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/ambassador")
], AmbassadorHomeController);
//# sourceMappingURL=HomeController.js.map