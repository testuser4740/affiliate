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
exports.TaskSubmission = void 0;
const typeorm_1 = require("typeorm");
let TaskSubmission = class TaskSubmission {
};
exports.TaskSubmission = TaskSubmission;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TaskSubmission.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "submission_id", type: "varchar", length: 32 }),
    __metadata("design:type", String)
], TaskSubmission.prototype, "submissionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "ambassador", type: "varchar", length: 255 }),
    __metadata("design:type", String)
], TaskSubmission.prototype, "ambassador", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], TaskSubmission.prototype, "college", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "task", type: "varchar", length: 255 }),
    __metadata("design:type", String)
], TaskSubmission.prototype, "task", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "submitted_on", type: "varchar", length: 64, nullable: true }),
    __metadata("design:type", String)
], TaskSubmission.prototype, "submittedOn", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 512, nullable: true }),
    __metadata("design:type", String)
], TaskSubmission.prototype, "proof", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32, default: "Pending Review" }),
    __metadata("design:type", String)
], TaskSubmission.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], TaskSubmission.prototype, "rejectReason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    __metadata("design:type", Date)
], TaskSubmission.prototype, "createdAt", void 0);
exports.TaskSubmission = TaskSubmission = __decorate([
    (0, typeorm_1.Entity)("task_submissions")
], TaskSubmission);
//# sourceMappingURL=task-submissions.js.map