"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PocController = void 0;
const tslib_1 = require("tslib");
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const pocs_1 = require("../../models/pocs");
const poc_service_1 = require("../../services/poc.service");
const poc_dto_1 = require("../../../dto/poc.dto");
let PocController = class PocController {
    async list(region, role, q) {
        return this.service.list({ region, role, q });
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
exports.PocController = PocController;
tslib_1.__decorate([
    (0, typedi_1.Inject)(),
    tslib_1.__metadata("design:type", poc_service_1.PocService)
], PocController.prototype, "service", void 0);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)("/"),
    (0, routing_controllers_openapi_1.ResponseSchema)(pocs_1.Poc, { isArray: true }),
    tslib_1.__param(0, (0, routing_controllers_1.QueryParam)("region")),
    tslib_1.__param(1, (0, routing_controllers_1.QueryParam)("role")),
    tslib_1.__param(2, (0, routing_controllers_1.QueryParam)("q")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PocController.prototype, "list", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)("/:id"),
    (0, routing_controllers_openapi_1.ResponseSchema)(pocs_1.Poc),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("id")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PocController.prototype, "get", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Post)("/"),
    (0, routing_controllers_openapi_1.ResponseSchema)(pocs_1.Poc),
    tslib_1.__param(0, (0, routing_controllers_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [poc_dto_1.CreatePocInput]),
    tslib_1.__metadata("design:returntype", Promise)
], PocController.prototype, "create", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Put)("/:id"),
    (0, routing_controllers_openapi_1.ResponseSchema)(pocs_1.Poc),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("id")),
    tslib_1.__param(1, (0, routing_controllers_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, poc_dto_1.UpdatePocInput]),
    tslib_1.__metadata("design:returntype", Promise)
], PocController.prototype, "update", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Delete)("/:id"),
    (0, routing_controllers_1.OnUndefined)(204),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("id")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PocController.prototype, "remove", null);
exports.PocController = PocController = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/admin/pocs")
], PocController);
//# sourceMappingURL=PocsController.js.map