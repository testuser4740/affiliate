"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionHistory = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
let CommissionHistory = class CommissionHistory {
};
exports.CommissionHistory = CommissionHistory;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: "id", type: "varchar", length: 32 }),
    tslib_1.__metadata("design:type", String)
], CommissionHistory.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 64 }),
    tslib_1.__metadata("design:type", String)
], CommissionHistory.prototype, "date", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    tslib_1.__metadata("design:type", String)
], CommissionHistory.prototype, "product", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 128 }),
    tslib_1.__metadata("design:type", String)
], CommissionHistory.prototype, "category", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "url_label", type: "varchar", length: 128, nullable: true }),
    tslib_1.__metadata("design:type", String)
], CommissionHistory.prototype, "urlLabel", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "order_value", type: "decimal", precision: 14, scale: 2, default: 0 }),
    tslib_1.__metadata("design:type", Number)
], CommissionHistory.prototype, "orderValue", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "commission_pct", type: "decimal", precision: 5, scale: 2, default: 0 }),
    tslib_1.__metadata("design:type", Number)
], CommissionHistory.prototype, "commissionPct", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 14, scale: 2, default: 0 }),
    tslib_1.__metadata("design:type", Number)
], CommissionHistory.prototype, "commission", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32, default: "Placed" }),
    tslib_1.__metadata("design:type", String)
], CommissionHistory.prototype, "status", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "payout_status", type: "varchar", length: 32, default: "Pending" }),
    tslib_1.__metadata("design:type", String)
], CommissionHistory.prototype, "payoutStatus", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    tslib_1.__metadata("design:type", Date)
], CommissionHistory.prototype, "createdAt", void 0);
exports.CommissionHistory = CommissionHistory = tslib_1.__decorate([
    (0, typeorm_1.Entity)("commission_history")
], CommissionHistory);
//# sourceMappingURL=commission-history.js.map