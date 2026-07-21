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
exports.AffiliateUrlController = void 0;
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const affiliate_urls_1 = require("../../entities/affiliate-urls");
const affiliate_url_service_1 = require("../../services/affiliate-url.service");
const affiliate_url_dto_1 = require("../../dto/affiliate-url.dto");
let AffiliateUrlController = class AffiliateUrlController {
    async list(ambassador, channel, q) {
        return this.service.list({ ambassador, channel, q });
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
exports.AffiliateUrlController = AffiliateUrlController;
__decorate([
    (0, typedi_1.Inject)(),
    __metadata("design:type", affiliate_url_service_1.AffiliateUrlService)
], AffiliateUrlController.prototype, "service", void 0);
__decorate([
    (0, routing_controllers_1.Get)("/"),
    (0, routing_controllers_openapi_1.ResponseSchema)(affiliate_urls_1.AffiliateUrl, { isArray: true }),
    __param(0, (0, routing_controllers_1.QueryParam)("ambassador")),
    __param(1, (0, routing_controllers_1.QueryParam)("channel")),
    __param(2, (0, routing_controllers_1.QueryParam)("q")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AffiliateUrlController.prototype, "list", null);
__decorate([
    (0, routing_controllers_1.Get)("/:id"),
    (0, routing_controllers_openapi_1.ResponseSchema)(affiliate_urls_1.AffiliateUrl),
    __param(0, (0, routing_controllers_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AffiliateUrlController.prototype, "get", null);
__decorate([
    (0, routing_controllers_1.Post)("/"),
    (0, routing_controllers_openapi_1.ResponseSchema)(affiliate_urls_1.AffiliateUrl),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [affiliate_url_dto_1.CreateAffiliateUrlInput]),
    __metadata("design:returntype", Promise)
], AffiliateUrlController.prototype, "create", null);
__decorate([
    (0, routing_controllers_1.Put)("/:id"),
    (0, routing_controllers_openapi_1.ResponseSchema)(affiliate_urls_1.AffiliateUrl),
    __param(0, (0, routing_controllers_1.Param)("id")),
    __param(1, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, affiliate_url_dto_1.UpdateAffiliateUrlInput]),
    __metadata("design:returntype", Promise)
], AffiliateUrlController.prototype, "update", null);
__decorate([
    (0, routing_controllers_1.Delete)("/:id"),
    (0, routing_controllers_1.OnUndefined)(204),
    __param(0, (0, routing_controllers_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AffiliateUrlController.prototype, "remove", null);
exports.AffiliateUrlController = AffiliateUrlController = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/admin/affiliate-urls")
], AffiliateUrlController);
//# sourceMappingURL=affiliate-urls.js.map