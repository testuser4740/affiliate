"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderUtilizationLog = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
let OrderUtilizationLog = class OrderUtilizationLog {
};
exports.OrderUtilizationLog = OrderUtilizationLog;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], OrderUtilizationLog.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32 }),
    tslib_1.__metadata("design:type", String)
], OrderUtilizationLog.prototype, "code", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "order_id", type: "varchar", length: 32 }),
    tslib_1.__metadata("design:type", String)
], OrderUtilizationLog.prototype, "orderId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "customer_id", type: "varchar", length: 32 }),
    tslib_1.__metadata("design:type", String)
], OrderUtilizationLog.prototype, "customerId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "order_value", type: "decimal", precision: 14, scale: 2, default: 0 }),
    tslib_1.__metadata("design:type", Number)
], OrderUtilizationLog.prototype, "orderValue", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "used_at", type: "timestamp" }),
    tslib_1.__metadata("design:type", Date)
], OrderUtilizationLog.prototype, "usedAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 14, scale: 2, default: 0 }),
    tslib_1.__metadata("design:type", Number)
], OrderUtilizationLog.prototype, "discount", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "commission_pct", type: "decimal", precision: 5, scale: 2, default: 0 }),
    tslib_1.__metadata("design:type", Number)
], OrderUtilizationLog.prototype, "commissionPct", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "commission_value", type: "decimal", precision: 14, scale: 2, default: 0 }),
    tslib_1.__metadata("design:type", Number)
], OrderUtilizationLog.prototype, "commissionValue", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    tslib_1.__metadata("design:type", Date)
], OrderUtilizationLog.prototype, "createdAt", void 0);
exports.OrderUtilizationLog = OrderUtilizationLog = tslib_1.__decorate([
    (0, typeorm_1.Entity)("order_utilization_logs")
], OrderUtilizationLog);
//# sourceMappingURL=order-utilization-logs.js.map