"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payout = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
let Payout = class Payout {
};
exports.Payout = Payout;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: "id", type: "varchar", length: 32 }),
    tslib_1.__metadata("design:type", String)
], Payout.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 64 }),
    tslib_1.__metadata("design:type", String)
], Payout.prototype, "period", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 16 }),
    tslib_1.__metadata("design:type", String)
], Payout.prototype, "month", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 14, scale: 2, default: 0 }),
    tslib_1.__metadata("design:type", Number)
], Payout.prototype, "amount", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32, default: "Processing" }),
    tslib_1.__metadata("design:type", String)
], Payout.prototype, "status", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 64, nullable: true }),
    tslib_1.__metadata("design:type", String)
], Payout.prototype, "date", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    tslib_1.__metadata("design:type", Date)
], Payout.prototype, "createdAt", void 0);
exports.Payout = Payout = tslib_1.__decorate([
    (0, typeorm_1.Entity)("payouts")
], Payout);
//# sourceMappingURL=payouts.js.map