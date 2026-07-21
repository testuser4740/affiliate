"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferralCode = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
let ReferralCode = class ReferralCode {
};
exports.ReferralCode = ReferralCode;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: "varchar", length: 32 }),
    tslib_1.__metadata("design:type", String)
], ReferralCode.prototype, "code", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32 }),
    tslib_1.__metadata("design:type", String)
], ReferralCode.prototype, "type", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 16 }),
    tslib_1.__metadata("design:type", String)
], ReferralCode.prototype, "value", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 16, nullable: true }),
    tslib_1.__metadata("design:type", String)
], ReferralCode.prototype, "cap", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    tslib_1.__metadata("design:type", Number)
], ReferralCode.prototype, "uses", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 14, scale: 2, default: 0 }),
    tslib_1.__metadata("design:type", Number)
], ReferralCode.prototype, "gmv", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 14, scale: 2, default: 0 }),
    tslib_1.__metadata("design:type", Number)
], ReferralCode.prototype, "commission", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32, default: "Active" }),
    tslib_1.__metadata("design:type", String)
], ReferralCode.prototype, "status", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    tslib_1.__metadata("design:type", Date)
], ReferralCode.prototype, "createdAt", void 0);
exports.ReferralCode = ReferralCode = tslib_1.__decorate([
    (0, typeorm_1.Entity)("referral_codes")
], ReferralCode);
//# sourceMappingURL=referral-codes.js.map