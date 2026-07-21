"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLog = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
let ActivityLog = class ActivityLog {
};
exports.ActivityLog = ActivityLog;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], ActivityLog.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    tslib_1.__metadata("design:type", Date)
], ActivityLog.prototype, "date", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    tslib_1.__metadata("design:type", Number)
], ActivityLog.prototype, "clicks", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    tslib_1.__metadata("design:type", Number)
], ActivityLog.prototype, "signups", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    tslib_1.__metadata("design:type", Number)
], ActivityLog.prototype, "orders", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 14, scale: 2, default: 0 }),
    tslib_1.__metadata("design:type", Number)
], ActivityLog.prototype, "revenue", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    tslib_1.__metadata("design:type", Date)
], ActivityLog.prototype, "createdAt", void 0);
exports.ActivityLog = ActivityLog = tslib_1.__decorate([
    (0, typeorm_1.Entity)("activity_logs")
], ActivityLog);
//# sourceMappingURL=activity-logs.js.map