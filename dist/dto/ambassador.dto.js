"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAmbassadorInput = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class UpdateAmbassadorInput {
}
exports.UpdateAmbassadorInput = UpdateAmbassadorInput;
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateAmbassadorInput.prototype, "college", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateAmbassadorInput.prototype, "city", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateAmbassadorInput.prototype, "state", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateAmbassadorInput.prototype, "email", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateAmbassadorInput.prototype, "phone", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateAmbassadorInput.prototype, "avatar", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateAmbassadorInput.prototype, "tier", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    tslib_1.__metadata("design:type", Number)
], UpdateAmbassadorInput.prototype, "commissionPct", void 0);
//# sourceMappingURL=ambassador.dto.js.map