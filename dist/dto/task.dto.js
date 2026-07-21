"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewSubmissionInput = exports.AssignTaskInput = exports.UpdateTaskInput = exports.CreateTaskInput = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class CreateTaskInput {
}
exports.CreateTaskInput = CreateTaskInput;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateTaskInput.prototype, "title", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateTaskInput.prototype, "description", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    tslib_1.__metadata("design:type", String)
], CreateTaskInput.prototype, "deadline", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    tslib_1.__metadata("design:type", Number)
], CreateTaskInput.prototype, "reward", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(["Active", "Closed"]),
    tslib_1.__metadata("design:type", String)
], CreateTaskInput.prototype, "status", void 0);
class UpdateTaskInput {
}
exports.UpdateTaskInput = UpdateTaskInput;
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateTaskInput.prototype, "title", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateTaskInput.prototype, "description", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    tslib_1.__metadata("design:type", String)
], UpdateTaskInput.prototype, "deadline", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    tslib_1.__metadata("design:type", Number)
], UpdateTaskInput.prototype, "reward", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateTaskInput.prototype, "status", void 0);
class AssignTaskInput {
}
exports.AssignTaskInput = AssignTaskInput;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], AssignTaskInput.prototype, "ambassador", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], AssignTaskInput.prototype, "college", void 0);
class ReviewSubmissionInput {
}
exports.ReviewSubmissionInput = ReviewSubmissionInput;
tslib_1.__decorate([
    (0, class_validator_1.IsIn)(["Pending Review", "Approved", "Rejected", "Under Review", "Resubmitted"]),
    tslib_1.__metadata("design:type", String)
], ReviewSubmissionInput.prototype, "status", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], ReviewSubmissionInput.prototype, "rejectReason", void 0);
//# sourceMappingURL=task.dto.js.map