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
exports.Tier = void 0;
const typeorm_1 = require("typeorm");
let Tier = class Tier {
};
exports.Tier = Tier;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Tier.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 64 }),
    __metadata("design:type", String)
], Tier.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "min_revenue", type: "decimal", precision: 14, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Tier.prototype, "min", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "max_revenue", type: "decimal", precision: 14, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Tier.prototype, "max", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32, nullable: true }),
    __metadata("design:type", String)
], Tier.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 16, nullable: true }),
    __metadata("design:type", String)
], Tier.prototype, "icon", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 16 }),
    __metadata("design:type", String)
], Tier.prototype, "commission", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "simple-array", nullable: true }),
    __metadata("design:type", Array)
], Tier.prototype, "perks", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], Tier.prototype, "createdAt", void 0);
exports.Tier = Tier = __decorate([
    (0, typeorm_1.Entity)("tiers")
], Tier);
//# sourceMappingURL=tiers.js.map