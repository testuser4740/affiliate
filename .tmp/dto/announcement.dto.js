"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAnnouncementInput = exports.CreateAnnouncementInput = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class CreateAnnouncementInput {
}
exports.CreateAnnouncementInput = CreateAnnouncementInput;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateAnnouncementInput.prototype, "title", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateAnnouncementInput.prototype, "body", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(["All Ambassadors", "Gold + Platinum tiers", "Silver tier", "Bronze tier", "Specific city"]),
    tslib_1.__metadata("design:type", String)
], CreateAnnouncementInput.prototype, "audience", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(["High", "Medium", "Low"]),
    tslib_1.__metadata("design:type", String)
], CreateAnnouncementInput.prototype, "priority", void 0);
class UpdateAnnouncementInput {
}
exports.UpdateAnnouncementInput = UpdateAnnouncementInput;
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateAnnouncementInput.prototype, "title", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateAnnouncementInput.prototype, "body", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateAnnouncementInput.prototype, "audience", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateAnnouncementInput.prototype, "priority", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], UpdateAnnouncementInput.prototype, "sendToAmbassadors", void 0);
//# sourceMappingURL=announcement.dto.js.map