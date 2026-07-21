"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAffiliateUrlInput = exports.CreateAffiliateUrlInput = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class CreateAffiliateUrlInput {
}
exports.CreateAffiliateUrlInput = CreateAffiliateUrlInput;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateAffiliateUrlInput.prototype, "url", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateAffiliateUrlInput.prototype, "ambassador", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateAffiliateUrlInput.prototype, "college", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateAffiliateUrlInput.prototype, "label", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateAffiliateUrlInput.prototype, "campaign", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateAffiliateUrlInput.prototype, "channel", void 0);
class UpdateAffiliateUrlInput {
}
exports.UpdateAffiliateUrlInput = UpdateAffiliateUrlInput;
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateAffiliateUrlInput.prototype, "url", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateAffiliateUrlInput.prototype, "ambassador", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateAffiliateUrlInput.prototype, "college", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateAffiliateUrlInput.prototype, "label", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateAffiliateUrlInput.prototype, "campaign", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateAffiliateUrlInput.prototype, "channel", void 0);
//# sourceMappingURL=affiliate-url.dto.js.map