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
exports.CommissionOverride = void 0;
const typeorm_1 = require("typeorm");
let CommissionOverride = class CommissionOverride {
    async generateId() {
        if (this.id) {
            return;
        }
        const count = await this
            .constructor.getRepository?.()?.count({ where: { id: (0, typeorm_1.Like)(`CO-%`) } });
        const sequence = ((count ?? 0) + 1).toString().padStart(3, "0");
        this.id = `CO-${sequence}`;
    }
};
exports.CommissionOverride = CommissionOverride;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: "id", type: "varchar", length: 32 }),
    __metadata("design:type", String)
], CommissionOverride.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], CommissionOverride.prototype, "label", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "applies_to", type: "varchar", length: 128 }),
    __metadata("design:type", String)
], CommissionOverride.prototype, "appliesTo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "original_pct", type: "decimal", precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CommissionOverride.prototype, "originalPct", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "override_pct", type: "decimal", precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CommissionOverride.prototype, "overridePct", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "start_date", type: "date" }),
    __metadata("design:type", Date)
], CommissionOverride.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "end_date", type: "date" }),
    __metadata("design:type", Date)
], CommissionOverride.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32, default: "Scheduled" }),
    __metadata("design:type", String)
], CommissionOverride.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], CommissionOverride.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommissionOverride.prototype, "generateId", null);
exports.CommissionOverride = CommissionOverride = __decorate([
    (0, typeorm_1.Entity)("commission_overrides")
], CommissionOverride);
//# sourceMappingURL=commission-overrides.js.map