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
exports.AnnouncementController = void 0;
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const announcements_1 = require("../../entities/announcements");
const announcement_service_1 = require("../../services/announcement.service");
const announcement_dto_1 = require("../../dto/announcement.dto");
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
__decorate([
    (0, typedi_1.Inject)(),
    __metadata("design:type", announcement_service_1.AnnouncementService)
], AnnouncementController.prototype, "service", void 0);
__decorate([
    (0, routing_controllers_1.Get)("/"),
    (0, routing_controllers_openapi_1.ResponseSchema)(announcements_1.Announcement, { isArray: true }),
    __param(0, (0, routing_controllers_1.QueryParam)("audience")),
    __param(1, (0, routing_controllers_1.QueryParam)("priority")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "list", null);
__decorate([
    (0, routing_controllers_1.Get)("/:id"),
    (0, routing_controllers_openapi_1.ResponseSchema)(announcements_1.Announcement),
    __param(0, (0, routing_controllers_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "get", null);
__decorate([
    (0, routing_controllers_1.Post)("/"),
    (0, routing_controllers_openapi_1.ResponseSchema)(announcements_1.Announcement),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [announcement_dto_1.CreateAnnouncementInput]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "create", null);
__decorate([
    (0, routing_controllers_1.Put)("/:id"),
    (0, routing_controllers_openapi_1.ResponseSchema)(announcements_1.Announcement),
    __param(0, (0, routing_controllers_1.Param)("id")),
    __param(1, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, announcement_dto_1.UpdateAnnouncementInput]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "update", null);
__decorate([
    (0, routing_controllers_1.Delete)("/:id"),
    (0, routing_controllers_1.OnUndefined)(204),
    __param(0, (0, routing_controllers_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "remove", null);
exports.AnnouncementController = AnnouncementController = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/admin/announcements")
], AnnouncementController);
//# sourceMappingURL=announcements.js.map