"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AffiliateUrl = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
let AffiliateUrl = class AffiliateUrl {
    async generateId() {
        if (this.id) {
            return;
        }
        const count = await this
            .constructor.getRepository?.()?.count({ where: { id: (0, typeorm_1.Like)(`URL-%`) } });
        const sequence = ((count ?? 0) + 1).toString().padStart(3, "0");
        this.id = `URL-${sequence}`;
    }
};
exports.AffiliateUrl = AffiliateUrl;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: "id", type: "varchar", length: 32 }),
    tslib_1.__metadata("design:type", String)
], AffiliateUrl.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    tslib_1.__metadata("design:type", String)
], AffiliateUrl.prototype, "ambassador", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    tslib_1.__metadata("design:type", String)
], AffiliateUrl.prototype, "college", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 64 }),
    tslib_1.__metadata("design:type", String)
], AffiliateUrl.prototype, "label", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 512 }),
    tslib_1.__metadata("design:type", String)
], AffiliateUrl.prototype, "url", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 64, nullable: true }),
    tslib_1.__metadata("design:type", String)
], AffiliateUrl.prototype, "campaign", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32 }),
    tslib_1.__metadata("design:type", String)
], AffiliateUrl.prototype, "channel", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    tslib_1.__metadata("design:type", Number)
], AffiliateUrl.prototype, "clicks", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    tslib_1.__metadata("design:type", Number)
], AffiliateUrl.prototype, "signups", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    tslib_1.__metadata("design:type", Number)
], AffiliateUrl.prototype, "orders", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "revenue", type: "decimal", precision: 14, scale: 2, default: 0 }),
    tslib_1.__metadata("design:type", Number)
], AffiliateUrl.prototype, "revenue", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "commission", type: "decimal", precision: 14, scale: 2, default: 0 }),
    tslib_1.__metadata("design:type", Number)
], AffiliateUrl.prototype, "commission", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 5, scale: 2, nullable: true }),
    tslib_1.__metadata("design:type", Number)
], AffiliateUrl.prototype, "ctr", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "last_click", type: "timestamp", nullable: true }),
    tslib_1.__metadata("design:type", Date)
], AffiliateUrl.prototype, "lastClick", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "created_on", type: "date", nullable: true }),
    tslib_1.__metadata("design:type", Date)
], AffiliateUrl.prototype, "createdOn", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    tslib_1.__metadata("design:type", Date)
], AffiliateUrl.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.BeforeInsert)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], AffiliateUrl.prototype, "generateId", null);
exports.AffiliateUrl = AffiliateUrl = tslib_1.__decorate([
    (0, typeorm_1.Entity)("affiliate_urls")
], AffiliateUrl);
//# sourceMappingURL=affiliate-urls.js.map