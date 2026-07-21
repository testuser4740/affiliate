"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Applicant = void 0;
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
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: "id", type: "varchar", length: 32 }),
    __metadata("design:type", String)
], Applicant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "applicant_name", type: "varchar", length: 255 }),
    __metadata("design:type", String)
], Applicant.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32 }),
    __metadata("design:type", String)
], Applicant.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32, nullable: true }),
    __metadata("design:type", String)
], Applicant.prototype, "whatsapp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], Applicant.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32, nullable: true }),
    __metadata("design:type", String)
], Applicant.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], Applicant.prototype, "instagram", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], Applicant.prototype, "linkedin", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 128, nullable: true }),
    __metadata("design:type", String)
], Applicant.prototype, "clubInvolvement", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], Applicant.prototype, "college", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 128 }),
    __metadata("design:type", String)
], Applicant.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 128 }),
    __metadata("design:type", String)
], Applicant.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "commission_pct", type: "int", default: 0 }),
    __metadata("design:type", Number)
], Applicant.prototype, "commissionPct", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "applied_on", type: "date" }),
    __metadata("design:type", Date)
], Applicant.prototype, "appliedOn", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32, default: "Pending" }),
    __metadata("design:type", String)
], Applicant.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], Applicant.prototype, "duplicate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", default: "" }),
    __metadata("design:type", String)
], Applicant.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], Applicant.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Applicant.prototype, "generateId", null);
exports.Applicant = Applicant = __decorate([
    (0, typeorm_1.Entity)("applicants")
], Applicant);
//# sourceMappingURL=applicants.js.map