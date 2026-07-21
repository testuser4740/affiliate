"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityService = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const Logger_1 = require("../../decorators/Logger");
const ActivityRepository_1 = require("../repositories/ActivityRepository");
let ActivityService = class ActivityService {
    constructor(repository, logger) {
        this.repository = repository;
        this.logger = logger;
    }
    async recent(limit = 50) {
        return this.repository.repository.find({ order: { date: "DESC" }, take: limit });
    }
    async log(entry) {
        const record = this.repository.repository.create(entry);
        return this.repository.repository.save(record);
    }
};
exports.ActivityService = ActivityService;
exports.ActivityService = ActivityService = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__param(1, (0, Logger_1.Logger)(__filename)),
    tslib_1.__metadata("design:paramtypes", [ActivityRepository_1.ActivityRepository, Object])
], ActivityService);
//# sourceMappingURL=activity.service.js.map