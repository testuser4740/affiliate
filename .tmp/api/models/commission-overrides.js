"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionOverride = void 0;
const tslib_1 = require("tslib");
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
tslib_1.__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: "id", type: "varchar", length: 32 }),
    tslib_1.__metadata("design:type", String)
], CommissionOverride.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    tslib_1.__metadata("design:type", String)
], CommissionOverride.prototype, "label", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "applies_to", type: "varchar", length: 128 }),
    tslib_1.__metadata("design:type", String)
], CommissionOverride.prototype, "appliesTo", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "original_pct", type: "decimal", precision: 5, scale: 2, default: 0 }),
    tslib_1.__metadata("design:type", Number)
], CommissionOverride.prototype, "originalPct", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "override_pct", type: "decimal", precision: 5, scale: 2, default: 0 }),
    tslib_1.__metadata("design:type", Number)
], CommissionOverride.prototype, "overridePct", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "start_date", type: "date" }),
    tslib_1.__metadata("design:type", Date)
], CommissionOverride.prototype, "startDate", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "end_date", type: "date" }),
    tslib_1.__metadata("design:type", Date)
], CommissionOverride.prototype, "endDate", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32, default: "Scheduled" }),
    tslib_1.__metadata("design:type", String)
], CommissionOverride.prototype, "status", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    tslib_1.__metadata("design:type", Date)
], CommissionOverride.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.BeforeInsert)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], CommissionOverride.prototype, "generateId", null);
exports.CommissionOverride = CommissionOverride = tslib_1.__decorate([
    (0, typeorm_1.Entity)("commission_overrides")
], CommissionOverride);
//# sourceMappingURL=commission-overrides.js.map