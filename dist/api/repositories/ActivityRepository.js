"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityRepository = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const activity_logs_1 = require("../models/activity-logs");
const typeormLoader_1 = require("../../loaders/typeormLoader");
let ActivityRepository = class ActivityRepository {
    constructor() {
        this.repository = (0, typeormLoader_1.getConnection)().getRepository(activity_logs_1.ActivityLog);
    }
};
exports.ActivityRepository = ActivityRepository;
exports.ActivityRepository = ActivityRepository = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__metadata("design:paramtypes", [])
], ActivityRepository);
//# sourceMappingURL=ActivityRepository.js.map