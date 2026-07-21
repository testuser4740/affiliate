"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tier = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
let Tier = class Tier {
};
exports.Tier = Tier;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], Tier.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 64 }),
    tslib_1.__metadata("design:type", String)
], Tier.prototype, "name", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "min_revenue", type: "decimal", precision: 14, scale: 2, default: 0 }),
    tslib_1.__metadata("design:type", Number)
], Tier.prototype, "min", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "max_revenue", type: "decimal", precision: 14, scale: 2, default: 0 }),
    tslib_1.__metadata("design:type", Number)
], Tier.prototype, "max", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32, nullable: true }),
    tslib_1.__metadata("design:type", String)
], Tier.prototype, "color", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 16, nullable: true }),
    tslib_1.__metadata("design:type", String)
], Tier.prototype, "icon", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 16 }),
    tslib_1.__metadata("design:type", String)
], Tier.prototype, "commission", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "simple-array", nullable: true }),
    tslib_1.__metadata("design:type", Array)
], Tier.prototype, "perks", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    tslib_1.__metadata("design:type", Date)
], Tier.prototype, "createdAt", void 0);
exports.Tier = Tier = tslib_1.__decorate([
    (0, typeorm_1.Entity)("tiers")
], Tier);
//# sourceMappingURL=tiers.js.map