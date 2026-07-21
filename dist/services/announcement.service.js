"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementService = void 0;
const typedi_1 = require("typedi");
const data_source_1 = require("../data-source");
const announcements_1 = require("../entities/announcements");
const exceptions_1 = require("../exceptions");
let AnnouncementService = class AnnouncementService {
    repo() {
        return data_source_1.AppDataSource.getRepository(announcements_1.Announcement);
    }
    async list(audience, priority) {
        const where = {};
        if (audience)
            where.audience = audience;
        if (priority)
            where.priority = priority;
        const data = await this.repo().find({ where, order: { sentOn: "DESC" } });
        return { data, total: data.length };
    }
    async getById(id) {
        const item = await this.repo().findOne({ where: { id } });
        if (!item)
            throw new exceptions_1.NotFoundError(`Announcement ${id} not found`);
        return item;
    }
    async create(input) {
        if (!input.title?.trim())
            throw new exceptions_1.NotFoundError("Title is required");
        const item = this.repo().create({
            title: input.title,
            body: input.body ?? "",
            audience: input.audience ?? "All Ambassadors",
            priority: input.priority ?? "Medium",
            sendToAmbassadors: true,
            sentOn: new Date(),
        });
        return this.repo().save(item);
    }
    async update(id, input) {
        const repo = this.repo();
        const item = await this.getById(id);
        repo.merge(item, input);
        return repo.save(item);
    }
    async remove(id) {
        const repo = this.repo();
        const item = await this.getById(id);
        await repo.remove(item);
    }
    async forAudience(audience) {
        const where = {};
        if (audience)
            where.audience = audience;
        return this.repo().find({ where, order: { sentOn: "DESC" } });
    }
};
exports.AnnouncementService = AnnouncementService;
exports.AnnouncementService = AnnouncementService = __decorate([
    (0, typedi_1.Service)()
], AnnouncementService);
//# sourceMappingURL=announcement.service.js.map