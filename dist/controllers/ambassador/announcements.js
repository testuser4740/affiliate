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
exports.AmbassadorAnnouncementController = void 0;
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const announcements_1 = require("../../entities/announcements");
const announcement_service_1 = require("../../services/announcement.service");
let AmbassadorAnnouncementController = class AmbassadorAnnouncementController {
    /**
     * @openapi
     * /ambassador/{ambassadorId}/announcements:
     *   get:
     *     tags: [Ambassador / Announcements]
     *     summary: Announcements visible to this ambassador
     */
    async announcements(_ambassadorId, audience) {
        return this.service.forAudience(audience);
    }
};
exports.AmbassadorAnnouncementController = AmbassadorAnnouncementController;
__decorate([
    (0, typedi_1.Inject)(),
    __metadata("design:type", announcement_service_1.AnnouncementService)
], AmbassadorAnnouncementController.prototype, "service", void 0);
__decorate([
    (0, routing_controllers_1.Get)("/:ambassadorId/announcements"),
    (0, routing_controllers_openapi_1.ResponseSchema)(announcements_1.Announcement, { isArray: true }),
    __param(0, (0, routing_controllers_1.Param)("ambassadorId")),
    __param(1, (0, routing_controllers_1.QueryParam)("audience")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AmbassadorAnnouncementController.prototype, "announcements", null);
exports.AmbassadorAnnouncementController = AmbassadorAnnouncementController = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/ambassador")
], AmbassadorAnnouncementController);
//# sourceMappingURL=announcements.js.map