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
exports.Ambassador = void 0;
const typeorm_1 = require("typeorm");
let Ambassador = class Ambassador {
};
exports.Ambassador = Ambassador;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: "id", type: "varchar", length: 32 }),
    __metadata("design:type", String)
], Ambassador.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "ambassador_name", type: "varchar", length: 255 }),
    __metadata("design:type", String)
], Ambassador.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], Ambassador.prototype, "college", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 128 }),
    __metadata("design:type", String)
], Ambassador.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 128 }),
    __metadata("design:type", String)
], Ambassador.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], Ambassador.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32 }),
    __metadata("design:type", String)
], Ambassador.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "affiliate_link", type: "varchar", length: 512 }),
    __metadata("design:type", String)
], Ambassador.prototype, "affiliateLink", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 512, nullable: true }),
    __metadata("design:type", String)
], Ambassador.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32, default: "Bronze" }),
    __metadata("design:type", String)
], Ambassador.prototype, "tier", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], Ambassador.prototype, "rank", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "total_ambassadors", type: "int", default: 0 }),
    __metadata("design:type", Number)
], Ambassador.prototype, "totalAmbassadors", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "commission_pct", type: "int", default: 0 }),
    __metadata("design:type", Number)
], Ambassador.prototype, "commissionPct", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "revenue", type: "decimal", precision: 14, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Ambassador.prototype, "revenue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "orders", type: "int", default: 0 }),
    __metadata("design:type", Number)
], Ambassador.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], Ambassador.prototype, "createdAt", void 0);
exports.Ambassador = Ambassador = __decorate([
    (0, typeorm_1.Entity)("ambassadors")
], Ambassador);
//# sourceMappingURL=ambassadors.js.map