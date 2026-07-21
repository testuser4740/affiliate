"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementService = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const Logger_1 = require("../../decorators/Logger");
const AnnouncementRepository_1 = require("../repositories/AnnouncementRepository");
const errors_1 = require("../errors");
let AnnouncementService = class AnnouncementService {
    constructor(repository, log) {
        this.repository = repository;
        this.log = log;
    }
    async list(audience, priority) {
        const data = await this.repository.search({ audience, priority });
        return { data, total: data.length };
    }
    async getById(id) {
        const item = await this.repository.findOrFail(id);
        return item;
    }
    async create(input) {
        if (!input.title?.trim())
            throw new errors_1.NotFoundError("Title is required");
        const item = this.repository.repository.create({
            title: input.title,
            body: input.body ?? "",
            audience: input.audience ?? "All Ambassadors",
            priority: input.priority ?? "Medium",
            sendToAmbassadors: true,
            sentOn: new Date(),
        });
        this.log.info(`Announcement created: ${item.title}`);
        return this.repository.repository.save(item);
    }
    async update(id, input) {
        const repo = this.repository.repository;
        const item = await this.getById(id);
        repo.merge(item, input);
        return repo.save(item);
    }
    async remove(id) {
        const repo = this.repository.repository;
        const item = await this.getById(id);
        await repo.remove(item);
    }
    async forAudience(audience) {
        return this.repository.search({ audience });
    }
};
exports.AnnouncementService = AnnouncementService;
exports.AnnouncementService = AnnouncementService = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__param(1, (0, Logger_1.Logger)(__filename)),
    tslib_1.__metadata("design:paramtypes", [AnnouncementRepository_1.AnnouncementRepository, Object])
], AnnouncementService);
//# sourceMappingURL=announcement.service.js.map