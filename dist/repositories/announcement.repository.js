"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementRepository = void 0;
const typeorm_1 = require("typeorm");
const announcements_1 = require("../entities/announcements");
let AnnouncementRepository = class AnnouncementRepository extends typeorm_1.Repository {
    async search(filter) {
        const where = {};
        if (filter.audience)
            where.audience = filter.audience;
        if (filter.priority)
            where.priority = filter.priority;
        return this.find({ where, order: { sentOn: "DESC" } });
    }
    async findOrFail(id) {
        const item = await this.findOne({ where: { id } });
        if (!item) {
            const err = new Error(`Announcement ${id} not found`);
            err.status = 404;
            throw err;
        }
        return item;
    }
    async countByPrefix(prefix) {
        return this.count({ where: { id: (0, typeorm_1.Like)(`${prefix}%`) } });
    }
};
exports.AnnouncementRepository = AnnouncementRepository;
exports.AnnouncementRepository = AnnouncementRepository = __decorate([
    (0, typeorm_1.EntityRepository)(announcements_1.Announcement)
], AnnouncementRepository);
//# sourceMappingURL=announcement.repository.js.map