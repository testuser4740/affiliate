"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmbassadorController = void 0;
const tslib_1 = require("tslib");
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const ambassadors_1 = require("../../models/ambassadors");
const ambassador_service_1 = require("../../services/ambassador.service");
const ambassador_dto_1 = require("../../../dto/ambassador.dto");
let AmbassadorController = class AmbassadorController {
    async list(tier, state, city, q) {
        return this.service.list({ tier, state, city, q });
    }
    async get(id) {
        return this.service.getById(id);
    }
    async update(id, body) {
        return this.service.update(id, body);
    }
    /**
     * @openapi
     * /admin/ambassadors/leaderboard:
     *   get:
     *     tags: [Admin / Directory]
     *     summary: Master leaderboard ranked by revenue
     */
    async leaderboard(state) {
        return this.service.leaderboard(state);
    }
};
exports.AmbassadorController = AmbassadorController;
tslib_1.__decorate([
    (0, typedi_1.Inject)(),
    tslib_1.__metadata("design:type", ambassador_service_1.AmbassadorService)
], AmbassadorController.prototype, "service", void 0);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)("/"),
    (0, routing_controllers_openapi_1.ResponseSchema)(ambassadors_1.Ambassador, { isArray: true }),
    tslib_1.__param(0, (0, routing_controllers_1.QueryParam)("tier")),
    tslib_1.__param(1, (0, routing_controllers_1.QueryParam)("state")),
    tslib_1.__param(2, (0, routing_controllers_1.QueryParam)("city")),
    tslib_1.__param(3, (0, routing_controllers_1.QueryParam)("q")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], AmbassadorController.prototype, "list", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)("/:id"),
    (0, routing_controllers_openapi_1.ResponseSchema)(ambassadors_1.Ambassador),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("id")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AmbassadorController.prototype, "get", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Put)("/:id"),
    (0, routing_controllers_openapi_1.ResponseSchema)(ambassadors_1.Ambassador),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("id")),
    tslib_1.__param(1, (0, routing_controllers_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, ambassador_dto_1.UpdateAmbassadorInput]),
    tslib_1.__metadata("design:returntype", Promise)
], AmbassadorController.prototype, "update", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)("/leaderboard"),
    (0, routing_controllers_openapi_1.ResponseSchema)(ambassadors_1.Ambassador, { isArray: true }),
    tslib_1.__param(0, (0, routing_controllers_1.QueryParam)("state")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AmbassadorController.prototype, "leaderboard", null);
exports.AmbassadorController = AmbassadorController = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/admin/ambassadors")
], AmbassadorController);
//# sourceMappingURL=DirectoryController.js.map