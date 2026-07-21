"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AffiliateUrlController = void 0;
const tslib_1 = require("tslib");
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const affiliate_urls_1 = require("../../models/affiliate-urls");
const affiliate_url_service_1 = require("../../services/affiliate-url.service");
const affiliate_url_dto_1 = require("../../../dto/affiliate-url.dto");
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
tslib_1.__decorate([
    (0, typedi_1.Inject)(),
    tslib_1.__metadata("design:type", affiliate_url_service_1.AffiliateUrlService)
], AffiliateUrlController.prototype, "service", void 0);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)("/"),
    (0, routing_controllers_openapi_1.ResponseSchema)(affiliate_urls_1.AffiliateUrl, { isArray: true }),
    tslib_1.__param(0, (0, routing_controllers_1.QueryParam)("ambassador")),
    tslib_1.__param(1, (0, routing_controllers_1.QueryParam)("channel")),
    tslib_1.__param(2, (0, routing_controllers_1.QueryParam)("q")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], AffiliateUrlController.prototype, "list", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)("/:id"),
    (0, routing_controllers_openapi_1.ResponseSchema)(affiliate_urls_1.AffiliateUrl),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("id")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AffiliateUrlController.prototype, "get", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Post)("/"),
    (0, routing_controllers_openapi_1.ResponseSchema)(affiliate_urls_1.AffiliateUrl),
    tslib_1.__param(0, (0, routing_controllers_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [affiliate_url_dto_1.CreateAffiliateUrlInput]),
    tslib_1.__metadata("design:returntype", Promise)
], AffiliateUrlController.prototype, "create", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Put)("/:id"),
    (0, routing_controllers_openapi_1.ResponseSchema)(affiliate_urls_1.AffiliateUrl),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("id")),
    tslib_1.__param(1, (0, routing_controllers_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, affiliate_url_dto_1.UpdateAffiliateUrlInput]),
    tslib_1.__metadata("design:returntype", Promise)
], AffiliateUrlController.prototype, "update", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Delete)("/:id"),
    (0, routing_controllers_1.OnUndefined)(204),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("id")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AffiliateUrlController.prototype, "remove", null);
exports.AffiliateUrlController = AffiliateUrlController = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/admin/affiliate-urls")
], AffiliateUrlController);
//# sourceMappingURL=AffiliateUrlsController.js.map