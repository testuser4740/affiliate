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
exports.Poc = void 0;
const typeorm_1 = require("typeorm");
let Poc = class Poc {
    async generateId() {
        if (this.id) {
            return;
        }
        const count = await this
            .constructor.getRepository?.()?.count({ where: { id: (0, typeorm_1.Like)(`POC-%`) } });
        const sequence = ((count ?? 0) + 1).toString().padStart(3, "0");
        this.id = `POC-${sequence}`;
    }
};
exports.Poc = Poc;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: "id", type: "varchar", length: 32 }),
    __metadata("design:type", String)
], Poc.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], Poc.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 128 }),
    __metadata("design:type", String)
], Poc.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], Poc.prototype, "region", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    __metadata("design:type", String)
], Poc.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32, nullable: true }),
    __metadata("design:type", String)
], Poc.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32, nullable: true }),
    __metadata("design:type", String)
], Poc.prototype, "whatsapp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 512, nullable: true }),
    __metadata("design:type", String)
], Poc.prototype, "avatar", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "linked_affiliates", type: "simple-array", nullable: true }),
    __metadata("design:type", Array)
], Poc.prototype, "linkedAffiliates", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "working_hours", type: "varchar", length: 128, nullable: true }),
    __metadata("design:type", String)
], Poc.prototype, "workingHours", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], Poc.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Poc.prototype, "generateId", null);
exports.Poc = Poc = __decorate([
    (0, typeorm_1.Entity)("pocs")
], Poc);
//# sourceMappingURL=pocs.js.map