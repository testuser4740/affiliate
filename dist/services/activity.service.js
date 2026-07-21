"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityService = void 0;
const typedi_1 = require("typedi");
const data_source_1 = require("../data-source");
const activity_logs_1 = require("../entities/activity-logs");
let ActivityService = class ActivityService {
    async recent(limit = 50) {
        return data_source_1.AppDataSource.getRepository(activity_logs_1.ActivityLog).find({
            order: { date: "DESC" },
            take: limit,
        });
    }
    async log(entry) {
        const repo = data_source_1.AppDataSource.getRepository(activity_logs_1.ActivityLog);
        const record = repo.create(entry);
        return repo.save(record);
    }
};
exports.ActivityService = ActivityService;
exports.ActivityService = ActivityService = __decorate([
    (0, typedi_1.Service)()
], ActivityService);
//# sourceMappingURL=activity.service.js.map