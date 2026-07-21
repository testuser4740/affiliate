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
exports.Payout = void 0;
const typeorm_1 = require("typeorm");
let Payout = class Payout {
};
exports.Payout = Payout;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: "id", type: "varchar", length: 32 }),
    __metadata("design:type", String)
], Payout.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 64 }),
    __metadata("design:type", String)
], Payout.prototype, "period", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 16 }),
    __metadata("design:type", String)
], Payout.prototype, "month", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 14, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Payout.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32, default: "Processing" }),
    __metadata("design:type", String)
], Payout.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 64, nullable: true }),
    __metadata("design:type", String)
], Payout.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], Payout.prototype, "createdAt", void 0);
exports.Payout = Payout = __decorate([
    (0, typeorm_1.Entity)("payouts")
], Payout);
//# sourceMappingURL=payouts.js.map