"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
let Task = class Task {
    async generateId() {
        if (this.id) {
            return;
        }
        const count = await this
            .constructor.getRepository?.()?.count({ where: { id: (0, typeorm_1.Like)(`T-%`) } });
        const sequence = ((count ?? 0) + 1).toString().padStart(3, "0");
        this.id = `T-${sequence}`;
    }
};
exports.Task = Task;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: "id", type: "varchar", length: 32 }),
    tslib_1.__metadata("design:type", String)
], Task.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    tslib_1.__metadata("design:type", String)
], Task.prototype, "title", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    tslib_1.__metadata("design:type", String)
], Task.prototype, "description", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Task.prototype, "deadline", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    tslib_1.__metadata("design:type", Number)
], Task.prototype, "reward", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "assigned_count", type: "int", default: 0 }),
    tslib_1.__metadata("design:type", Number)
], Task.prototype, "assignedCount", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "completed_count", type: "int", default: 0 }),
    tslib_1.__metadata("design:type", Number)
], Task.prototype, "completedCount", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32, default: "Active" }),
    tslib_1.__metadata("design:type", String)
], Task.prototype, "status", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    tslib_1.__metadata("design:type", Date)
], Task.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.BeforeInsert)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], Task.prototype, "generateId", null);
exports.Task = Task = tslib_1.__decorate([
    (0, typeorm_1.Entity)("tasks")
], Task);
//# sourceMappingURL=tasks.js.map