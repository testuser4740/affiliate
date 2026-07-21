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
exports.OrderUtilizationLog = void 0;
const typeorm_1 = require("typeorm");
let OrderUtilizationLog = class OrderUtilizationLog {
};
exports.OrderUtilizationLog = OrderUtilizationLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OrderUtilizationLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32 }),
    __metadata("design:type", String)
], OrderUtilizationLog.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "order_id", type: "varchar", length: 32 }),
    __metadata("design:type", String)
], OrderUtilizationLog.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "customer_id", type: "varchar", length: 32 }),
    __metadata("design:type", String)
], OrderUtilizationLog.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "order_value", type: "decimal", precision: 14, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], OrderUtilizationLog.prototype, "orderValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "used_at", type: "timestamp" }),
    __metadata("design:type", Date)
], OrderUtilizationLog.prototype, "usedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 14, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], OrderUtilizationLog.prototype, "discount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "commission_pct", type: "decimal", precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], OrderUtilizationLog.prototype, "commissionPct", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "commission_value", type: "decimal", precision: 14, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], OrderUtilizationLog.prototype, "commissionValue", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], OrderUtilizationLog.prototype, "createdAt", void 0);
exports.OrderUtilizationLog = OrderUtilizationLog = __decorate([
    (0, typeorm_1.Entity)("order_utilization_logs")
], OrderUtilizationLog);
//# sourceMappingURL=order-utilization-logs.js.map