"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementController = void 0;
const tslib_1 = require("tslib");
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const announcements_1 = require("../../models/announcements");
const announcement_service_1 = require("../../services/announcement.service");
const announcement_dto_1 = require("../../../dto/announcement.dto");
let AnnouncementController = class AnnouncementController {
    async list(audience, priority) {
        return this.service.list(audience, priority);
    }
    async get(id) {
        return this.service.getById(id);
    }
    /**
     * @openapi
     * /admin/announcements:
     *   post:
     *     tags: [Admin / Announcements]
     *     summary: Create & send an announcement
     */
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
exports.AnnouncementController = AnnouncementController;
tslib_1.__decorate([
    (0, typedi_1.Inject)(),
    tslib_1.__metadata("design:type", announcement_service_1.AnnouncementService)
], AnnouncementController.prototype, "service", void 0);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)("/"),
    (0, routing_controllers_openapi_1.ResponseSchema)(announcements_1.Announcement, { isArray: true }),
    tslib_1.__param(0, (0, routing_controllers_1.QueryParam)("audience")),
    tslib_1.__param(1, (0, routing_controllers_1.QueryParam)("priority")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], AnnouncementController.prototype, "list", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)("/:id"),
    (0, routing_controllers_openapi_1.ResponseSchema)(announcements_1.Announcement),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("id")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AnnouncementController.prototype, "get", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Post)("/"),
    (0, routing_controllers_openapi_1.ResponseSchema)(announcements_1.Announcement),
    tslib_1.__param(0, (0, routing_controllers_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [announcement_dto_1.CreateAnnouncementInput]),
    tslib_1.__metadata("design:returntype", Promise)
], AnnouncementController.prototype, "create", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Put)("/:id"),
    (0, routing_controllers_openapi_1.ResponseSchema)(announcements_1.Announcement),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("id")),
    tslib_1.__param(1, (0, routing_controllers_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, announcement_dto_1.UpdateAnnouncementInput]),
    tslib_1.__metadata("design:returntype", Promise)
], AnnouncementController.prototype, "update", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Delete)("/:id"),
    (0, routing_controllers_1.OnUndefined)(204),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("id")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AnnouncementController.prototype, "remove", null);
exports.AnnouncementController = AnnouncementController = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/admin/announcements")
], AnnouncementController);
//# sourceMappingURL=AnnouncementsController.js.map