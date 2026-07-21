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
exports.ReferralCode = void 0;
const typeorm_1 = require("typeorm");
let ReferralCode = class ReferralCode {
};
exports.ReferralCode = ReferralCode;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: "varchar", length: 32 }),
    __metadata("design:type", String)
], ReferralCode.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32 }),
    __metadata("design:type", String)
], ReferralCode.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 16 }),
    __metadata("design:type", String)
], ReferralCode.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 16, nullable: true }),
    __metadata("design:type", String)
], ReferralCode.prototype, "cap", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], ReferralCode.prototype, "uses", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 14, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ReferralCode.prototype, "gmv", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 14, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ReferralCode.prototype, "commission", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32, default: "Active" }),
    __metadata("design:type", String)
], ReferralCode.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], ReferralCode.prototype, "createdAt", void 0);
exports.ReferralCode = ReferralCode = __decorate([
    (0, typeorm_1.Entity)("referral_codes")
], ReferralCode);
//# sourceMappingURL=referral-codes.js.map