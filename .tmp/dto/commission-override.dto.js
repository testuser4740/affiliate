"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCommissionOverrideInput = exports.CreateCommissionOverrideInput = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class CreateCommissionOverrideInput {
}
exports.CreateCommissionOverrideInput = CreateCommissionOverrideInput;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateCommissionOverrideInput.prototype, "label", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateCommissionOverrideInput.prototype, "appliesTo", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    tslib_1.__metadata("design:type", Number)
], CreateCommissionOverrideInput.prototype, "overridePct", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    tslib_1.__metadata("design:type", Number)
], CreateCommissionOverrideInput.prototype, "originalPct", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    tslib_1.__metadata("design:type", String)
], CreateCommissionOverrideInput.prototype, "startDate", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    tslib_1.__metadata("design:type", String)
], CreateCommissionOverrideInput.prototype, "endDate", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(["Scheduled", "Active", "Expired"]),
    tslib_1.__metadata("design:type", String)
], CreateCommissionOverrideInput.prototype, "status", void 0);
class UpdateCommissionOverrideInput {
}
exports.UpdateCommissionOverrideInput = UpdateCommissionOverrideInput;
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateCommissionOverrideInput.prototype, "label", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateCommissionOverrideInput.prototype, "appliesTo", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    tslib_1.__metadata("design:type", Number)
], UpdateCommissionOverrideInput.prototype, "overridePct", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    tslib_1.__metadata("design:type", Number)
], UpdateCommissionOverrideInput.prototype, "originalPct", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    tslib_1.__metadata("design:type", String)
], UpdateCommissionOverrideInput.prototype, "startDate", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    tslib_1.__metadata("design:type", String)
], UpdateCommissionOverrideInput.prototype, "endDate", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateCommissionOverrideInput.prototype, "status", void 0);
//# sourceMappingURL=commission-override.dto.js.map