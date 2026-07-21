"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionOverrideController = void 0;
const tslib_1 = require("tslib");
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const commission_overrides_1 = require("../../models/commission-overrides");
const commission_override_service_1 = require("../../services/commission-override.service");
const commission_override_dto_1 = require("../../../dto/commission-override.dto");
let CommissionOverrideController = class CommissionOverrideController {
    async list(status, q) {
        return this.service.list({ status, q });
    }
    async get(id) {
        return this.service.getById(id);
    }
    async create(body) {
        return this.service.create(body);
    }
    async update(id, body) {
        return this.service.update(id, body);
    }
    async remove(id) {
        return this.service.remove(id);
    }
};
exports.CommissionOverrideController = CommissionOverrideController;
tslib_1.__decorate([
    (0, typedi_1.Inject)(),
    tslib_1.__metadata("design:type", commission_override_service_1.CommissionOverrideService)
], CommissionOverrideController.prototype, "service", void 0);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)("/"),
    (0, routing_controllers_openapi_1.ResponseSchema)(commission_overrides_1.CommissionOverride, { isArray: true }),
    tslib_1.__param(0, (0, routing_controllers_1.QueryParam)("status")),
    tslib_1.__param(1, (0, routing_controllers_1.QueryParam)("q")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], CommissionOverrideController.prototype, "list", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)("/:id"),
    (0, routing_controllers_openapi_1.ResponseSchema)(commission_overrides_1.CommissionOverride),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("id")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], CommissionOverrideController.prototype, "get", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Post)("/"),
    (0, routing_controllers_openapi_1.ResponseSchema)(commission_overrides_1.CommissionOverride),
    tslib_1.__param(0, (0, routing_controllers_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [commission_override_dto_1.CreateCommissionOverrideInput]),
    tslib_1.__metadata("design:returntype", Promise)
], CommissionOverrideController.prototype, "create", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Put)("/:id"),
    (0, routing_controllers_openapi_1.ResponseSchema)(commission_overrides_1.CommissionOverride),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("id")),
    tslib_1.__param(1, (0, routing_controllers_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, commission_override_dto_1.UpdateCommissionOverrideInput]),
    tslib_1.__metadata("design:returntype", Promise)
], CommissionOverrideController.prototype, "update", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Delete)("/:id"),
    (0, routing_controllers_1.OnUndefined)(204),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("id")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], CommissionOverrideController.prototype, "remove", null);
exports.CommissionOverrideController = CommissionOverrideController = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/admin/commission-overrides")
], CommissionOverrideController);
//# sourceMappingURL=CommissionOverridesController.js.map