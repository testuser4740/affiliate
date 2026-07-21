"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementRepository = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const typedi_1 = require("typedi");
const announcements_1 = require("../models/announcements");
const typeormLoader_1 = require("../../loaders/typeormLoader");
let AnnouncementRepository = class AnnouncementRepository {
    constructor() {
        this.repository = (0, typeormLoader_1.getConnection)().getRepository(announcements_1.Announcement);
    }
    async search(filter) {
        const where = {};
        if (filter.audience)
            where.audience = filter.audience;
        if (filter.priority)
            where.priority = filter.priority;
        return this.repository.find({ where, order: { sentOn: 'DESC' } });
    }
    async findOrFail(id) {
        const item = await this.repository.findOne({ where: { id } });
        if (!item) {
            const err = new Error(`Announcement ${id} not found`);
            err.status = 404;
            throw err;
        }
        return item;
    }
    async countByPrefix(prefix) {
        return this.repository.count({ where: { id: (0, typeorm_1.Like)(`${prefix}%`) } });
    }
};
exports.AnnouncementRepository = AnnouncementRepository;
exports.AnnouncementRepository = AnnouncementRepository = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__metadata("design:paramtypes", [])
], AnnouncementRepository);
//# sourceMappingURL=AnnouncementRepository.js.map