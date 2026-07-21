"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poc = void 0;
const tslib_1 = require("tslib");
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
tslib_1.__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: "id", type: "varchar", length: 32 }),
    tslib_1.__metadata("design:type", String)
], Poc.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    tslib_1.__metadata("design:type", String)
], Poc.prototype, "name", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 128 }),
    tslib_1.__metadata("design:type", String)
], Poc.prototype, "role", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    tslib_1.__metadata("design:type", String)
], Poc.prototype, "region", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255, nullable: true }),
    tslib_1.__metadata("design:type", String)
], Poc.prototype, "email", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32, nullable: true }),
    tslib_1.__metadata("design:type", String)
], Poc.prototype, "phone", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32, nullable: true }),
    tslib_1.__metadata("design:type", String)
], Poc.prototype, "whatsapp", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 512, nullable: true }),
    tslib_1.__metadata("design:type", String)
], Poc.prototype, "avatar", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "linked_affiliates", type: "simple-array", nullable: true }),
    tslib_1.__metadata("design:type", Array)
], Poc.prototype, "linkedAffiliates", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "working_hours", type: "varchar", length: 128, nullable: true }),
    tslib_1.__metadata("design:type", String)
], Poc.prototype, "workingHours", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    tslib_1.__metadata("design:type", Date)
], Poc.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.BeforeInsert)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], Poc.prototype, "generateId", null);
exports.Poc = Poc = tslib_1.__decorate([
    (0, typeorm_1.Entity)("pocs")
], Poc);
//# sourceMappingURL=pocs.js.map