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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const tasks_1 = require("../../entities/tasks");
const task_submissions_1 = require("../../entities/task-submissions");
const task_service_1 = require("../../services/task.service");
const task_dto_1 = require("../../dto/task.dto");
let TaskController = class TaskController {
    async list(status, q) {
        return this.service.list({ status, q });
    }
    async get(id) {
        return this.service.getById(id);
    }
    async create(body) {
        return this.service.create(body);
    }
    async update(id, body) {
        return this.service.update(id, body);
    }
    async remove(id) {
        return this.service.remove(id);
    }
    /**
     * @openapi
     * /admin/tasks/{id}/assign:
     *   post:
     *     tags: [Admin / Tasks]
     *     summary: Assign a task to an ambassador (creates a submission)
     */
    async assign(id, body) {
        return this.service.assign(id, body);
    }
    async submissions(status) {
        return this.service.submissions(status);
    }
    /**
     * @openapi
     * /admin/tasks/submissions/{submissionId}/review:
     *   post:
     *     tags: [Admin / Tasks]
     *     summary: Review a submission (approve/reject/resubmit)
     */
    async review(submissionId, body) {
        return this.service.review(submissionId, body);
    }
};
exports.TaskController = TaskController;
__decorate([
    (0, typedi_1.Inject)(),
    __metadata("design:type", task_service_1.TaskService)
], TaskController.prototype, "service", void 0);
__decorate([
    (0, routing_controllers_1.Get)("/"),
    (0, routing_controllers_openapi_1.ResponseSchema)(tasks_1.Task, { isArray: true }),
    __param(0, (0, routing_controllers_1.QueryParam)("status")),
    __param(1, (0, routing_controllers_1.QueryParam)("q")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "list", null);
__decorate([
    (0, routing_controllers_1.Get)("/:id"),
    (0, routing_controllers_openapi_1.ResponseSchema)(tasks_1.Task),
    __param(0, (0, routing_controllers_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "get", null);
__decorate([
    (0, routing_controllers_1.Post)("/"),
    (0, routing_controllers_openapi_1.ResponseSchema)(tasks_1.Task),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [task_dto_1.CreateTaskInput]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "create", null);
__decorate([
    (0, routing_controllers_1.Put)("/:id"),
    (0, routing_controllers_openapi_1.ResponseSchema)(tasks_1.Task),
    __param(0, (0, routing_controllers_1.Param)("id")),
    __param(1, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, task_dto_1.UpdateTaskInput]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "update", null);
__decorate([
    (0, routing_controllers_1.Delete)("/:id"),
    (0, routing_controllers_1.OnUndefined)(204),
    __param(0, (0, routing_controllers_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "remove", null);
__decorate([
    (0, routing_controllers_1.Post)("/:id/assign"),
    (0, routing_controllers_openapi_1.ResponseSchema)(task_submissions_1.TaskSubmission),
    __param(0, (0, routing_controllers_1.Param)("id")),
    __param(1, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, task_dto_1.AssignTaskInput]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "assign", null);
__decorate([
    (0, routing_controllers_1.Get)("/submissions"),
    (0, routing_controllers_openapi_1.ResponseSchema)(task_submissions_1.TaskSubmission, { isArray: true }),
    __param(0, (0, routing_controllers_1.QueryParam)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "submissions", null);
__decorate([
    (0, routing_controllers_1.Post)("/submissions/:submissionId/review"),
    (0, routing_controllers_openapi_1.ResponseSchema)(task_submissions_1.TaskSubmission),
    __param(0, (0, routing_controllers_1.Param)("submissionId")),
    __param(1, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, task_dto_1.ReviewSubmissionInput]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "review", null);
exports.TaskController = TaskController = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/admin/tasks")
], TaskController);
//# sourceMappingURL=tasks.js.map