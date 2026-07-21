"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Applicant = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
let Applicant = class Applicant {
    async generateId() {
        if (this.id) {
            return;
        }
        const year = new Date().getFullYear();
        const prefix = `AP-${year}-`;
        const count = await this
            .constructor.getRepository?.()?.count({ where: { id: (0, typeorm_1.Like)(`${prefix}%`) } });
        const sequence = ((count ?? 0) + 1).toString().padStart(4, "0");
        this.id = `${prefix}${sequence}`;
    }
};
exports.Applicant = Applicant;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: "id", type: "varchar", length: 32 }),
    tslib_1.__metadata("design:type", String)
], Applicant.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "applicant_name", type: "varchar", length: 255 }),
    tslib_1.__metadata("design:type", String)
], Applicant.prototype, "name", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32 }),
    tslib_1.__metadata("design:type", String)
], Applicant.prototype, "phone", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32, nullable: true }),
    tslib_1.__metadata("design:type", String)
], Applicant.prototype, "whatsapp", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    tslib_1.__metadata("design:type", String)
], Applicant.prototype, "email", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32, nullable: true }),
    tslib_1.__metadata("design:type", String)
], Applicant.prototype, "year", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    tslib_1.__metadata("design:type", String)
], Applicant.prototype, "instagram", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    tslib_1.__metadata("design:type", String)
], Applicant.prototype, "linkedin", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 128, nullable: true }),
    tslib_1.__metadata("design:type", String)
], Applicant.prototype, "clubInvolvement", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    tslib_1.__metadata("design:type", String)
], Applicant.prototype, "college", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 128 }),
    tslib_1.__metadata("design:type", String)
], Applicant.prototype, "city", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 128 }),
    tslib_1.__metadata("design:type", String)
], Applicant.prototype, "state", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "commission_pct", type: "int", default: 0 }),
    tslib_1.__metadata("design:type", Number)
], Applicant.prototype, "commissionPct", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "applied_on", type: "date" }),
    tslib_1.__metadata("design:type", Date)
], Applicant.prototype, "appliedOn", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32, default: "Pending" }),
    tslib_1.__metadata("design:type", String)
], Applicant.prototype, "status", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Applicant.prototype, "duplicate", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "text", default: "" }),
    tslib_1.__metadata("design:type", String)
], Applicant.prototype, "comments", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    tslib_1.__metadata("design:type", Date)
], Applicant.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.BeforeInsert)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], Applicant.prototype, "generateId", null);
exports.Applicant = Applicant = tslib_1.__decorate([
    (0, typeorm_1.Entity)("applicants")
], Applicant);
//# sourceMappingURL=applicants.js.map