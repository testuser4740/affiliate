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
exports.AmbassadorController = void 0;
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const ambassadors_1 = require("../../entities/ambassadors");
const ambassador_service_1 = require("../../services/ambassador.service");
const ambassador_dto_1 = require("../../dto/ambassador.dto");
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
__decorate([
    (0, typedi_1.Inject)(),
    __metadata("design:type", ambassador_service_1.AmbassadorService)
], AmbassadorController.prototype, "service", void 0);
__decorate([
    (0, routing_controllers_1.Get)("/"),
    (0, routing_controllers_openapi_1.ResponseSchema)(ambassadors_1.Ambassador, { isArray: true }),
    __param(0, (0, routing_controllers_1.QueryParam)("tier")),
    __param(1, (0, routing_controllers_1.QueryParam)("state")),
    __param(2, (0, routing_controllers_1.QueryParam)("city")),
    __param(3, (0, routing_controllers_1.QueryParam)("q")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AmbassadorController.prototype, "list", null);
__decorate([
    (0, routing_controllers_1.Get)("/:id"),
    (0, routing_controllers_openapi_1.ResponseSchema)(ambassadors_1.Ambassador),
    __param(0, (0, routing_controllers_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AmbassadorController.prototype, "get", null);
__decorate([
    (0, routing_controllers_1.Put)("/:id"),
    (0, routing_controllers_openapi_1.ResponseSchema)(ambassadors_1.Ambassador),
    __param(0, (0, routing_controllers_1.Param)("id")),
    __param(1, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ambassador_dto_1.UpdateAmbassadorInput]),
    __metadata("design:returntype", Promise)
], AmbassadorController.prototype, "update", null);
__decorate([
    (0, routing_controllers_1.Get)("/leaderboard"),
    (0, routing_controllers_openapi_1.ResponseSchema)(ambassadors_1.Ambassador, { isArray: true }),
    __param(0, (0, routing_controllers_1.QueryParam)("state")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AmbassadorController.prototype, "leaderboard", null);
exports.AmbassadorController = AmbassadorController = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/admin/ambassadors")
], AmbassadorController);
//# sourceMappingURL=directory.js.map