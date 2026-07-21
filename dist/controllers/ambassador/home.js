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
exports.AmbassadorHomeController = void 0;
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const ambassadors_1 = require("../../entities/ambassadors");
const dashboard_service_1 = require("../../services/dashboard.service");
const ambassador_service_1 = require("../../services/ambassador.service");
const ambassador_dto_1 = require("../../dto/ambassador.dto");
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
__decorate([
    (0, typedi_1.Inject)(),
    __metadata("design:type", dashboard_service_1.DashboardService)
], AmbassadorHomeController.prototype, "dashboard", void 0);
__decorate([
    (0, typedi_1.Inject)(),
    __metadata("design:type", ambassador_service_1.AmbassadorService)
], AmbassadorHomeController.prototype, "ambassadors", void 0);
__decorate([
    (0, routing_controllers_1.Get)("/:ambassadorId/home"),
    __param(0, (0, routing_controllers_1.Param)("ambassadorId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AmbassadorHomeController.prototype, "home", null);
__decorate([
    (0, routing_controllers_1.Get)("/:ambassadorId/profile"),
    (0, routing_controllers_openapi_1.ResponseSchema)(ambassadors_1.Ambassador),
    __param(0, (0, routing_controllers_1.Param)("ambassadorId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AmbassadorHomeController.prototype, "profile", null);
__decorate([
    (0, routing_controllers_1.Put)("/:ambassadorId/profile"),
    (0, routing_controllers_openapi_1.ResponseSchema)(ambassadors_1.Ambassador),
    __param(0, (0, routing_controllers_1.Param)("ambassadorId")),
    __param(1, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ambassador_dto_1.UpdateAmbassadorInput]),
    __metadata("design:returntype", Promise)
], AmbassadorHomeController.prototype, "updateProfile", null);
exports.AmbassadorHomeController = AmbassadorHomeController = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/ambassador")
], AmbassadorHomeController);
//# sourceMappingURL=home.js.map