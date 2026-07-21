"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmbassadorAnnouncementController = void 0;
const tslib_1 = require("tslib");
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const announcements_1 = require("../../models/announcements");
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
tslib_1.__decorate([
    (0, typedi_1.Inject)(),
    tslib_1.__metadata("design:type", announcement_service_1.AnnouncementService)
], AmbassadorAnnouncementController.prototype, "service", void 0);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)("/:ambassadorId/announcements"),
    (0, routing_controllers_openapi_1.ResponseSchema)(announcements_1.Announcement, { isArray: true }),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("ambassadorId")),
    tslib_1.__param(1, (0, routing_controllers_1.QueryParam)("audience")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], AmbassadorAnnouncementController.prototype, "announcements", null);
exports.AmbassadorAnnouncementController = AmbassadorAnnouncementController = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/ambassador")
], AmbassadorAnnouncementController);
//# sourceMappingURL=AnnouncementsController.js.map