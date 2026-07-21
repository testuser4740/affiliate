"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Announcement = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
let Announcement = class Announcement {
    async generateId() {
        if (this.id) {
            return;
        }
        const count = await this
            .constructor.getRepository?.()?.count({ where: { id: (0, typeorm_1.Like)(`ANN-%`) } });
        const sequence = ((count ?? 0) + 1).toString().padStart(3, "0");
        this.id = `ANN-${sequence}`;
    }
};
exports.Announcement = Announcement;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: "id", type: "varchar", length: 32 }),
    tslib_1.__metadata("design:type", String)
], Announcement.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    tslib_1.__metadata("design:type", String)
], Announcement.prototype, "title", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    tslib_1.__metadata("design:type", String)
], Announcement.prototype, "body", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 64 }),
    tslib_1.__metadata("design:type", String)
], Announcement.prototype, "audience", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "sent_on", type: "timestamp", nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Announcement.prototype, "sentOn", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    tslib_1.__metadata("design:type", Number)
], Announcement.prototype, "reads", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    tslib_1.__metadata("design:type", Number)
], Announcement.prototype, "total", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32, default: "Medium" }),
    tslib_1.__metadata("design:type", String)
], Announcement.prototype, "priority", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "send_to_ambassadors", type: "boolean", default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Announcement.prototype, "sendToAmbassadors", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    tslib_1.__metadata("design:type", Date)
], Announcement.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.BeforeInsert)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], Announcement.prototype, "generateId", null);
exports.Announcement = Announcement = tslib_1.__decorate([
    (0, typeorm_1.Entity)("announcements")
], Announcement);
//# sourceMappingURL=announcements.js.map