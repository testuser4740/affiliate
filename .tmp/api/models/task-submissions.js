"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskSubmission = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
let TaskSubmission = class TaskSubmission {
};
exports.TaskSubmission = TaskSubmission;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], TaskSubmission.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "submission_id", type: "varchar", length: 32 }),
    tslib_1.__metadata("design:type", String)
], TaskSubmission.prototype, "submissionId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "ambassador", type: "varchar", length: 255 }),
    tslib_1.__metadata("design:type", String)
], TaskSubmission.prototype, "ambassador", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    tslib_1.__metadata("design:type", String)
], TaskSubmission.prototype, "college", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "task", type: "varchar", length: 255 }),
    tslib_1.__metadata("design:type", String)
], TaskSubmission.prototype, "task", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "submitted_on", type: "varchar", length: 64, nullable: true }),
    tslib_1.__metadata("design:type", String)
], TaskSubmission.prototype, "submittedOn", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 512, nullable: true }),
    tslib_1.__metadata("design:type", String)
], TaskSubmission.prototype, "proof", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32, default: "Pending Review" }),
    tslib_1.__metadata("design:type", String)
], TaskSubmission.prototype, "status", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    tslib_1.__metadata("design:type", String)
], TaskSubmission.prototype, "rejectReason", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    tslib_1.__metadata("design:type", Date)
], TaskSubmission.prototype, "createdAt", void 0);
exports.TaskSubmission = TaskSubmission = tslib_1.__decorate([
    (0, typeorm_1.Entity)("task_submissions")
], TaskSubmission);
//# sourceMappingURL=task-submissions.js.map