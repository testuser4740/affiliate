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
exports.CommissionHistory = void 0;
const typeorm_1 = require("typeorm");
let CommissionHistory = class CommissionHistory {
};
exports.CommissionHistory = CommissionHistory;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: "id", type: "varchar", length: 32 }),
    __metadata("design:type", String)
], CommissionHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 64 }),
    __metadata("design:type", String)
], CommissionHistory.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], CommissionHistory.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 128 }),
    __metadata("design:type", String)
], CommissionHistory.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "url_label", type: "varchar", length: 128, nullable: true }),
    __metadata("design:type", String)
], CommissionHistory.prototype, "urlLabel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "order_value", type: "decimal", precision: 14, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CommissionHistory.prototype, "orderValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "commission_pct", type: "decimal", precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CommissionHistory.prototype, "commissionPct", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 14, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], CommissionHistory.prototype, "commission", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32, default: "Placed" }),
    __metadata("design:type", String)
], CommissionHistory.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "payout_status", type: "varchar", length: 32, default: "Pending" }),
    __metadata("design:type", String)
], CommissionHistory.prototype, "payoutStatus", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], CommissionHistory.prototype, "createdAt", void 0);
exports.CommissionHistory = CommissionHistory = __decorate([
    (0, typeorm_1.Entity)("commission_history")
], CommissionHistory);
//# sourceMappingURL=commission-history.js.map