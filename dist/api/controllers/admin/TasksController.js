"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const tslib_1 = require("tslib");
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const tasks_1 = require("../../models/tasks");
const task_submissions_1 = require("../../models/task-submissions");
const task_service_1 = require("../../services/task.service");
const task_dto_1 = require("../../../dto/task.dto");
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
tslib_1.__decorate([
    (0, typedi_1.Inject)(),
    tslib_1.__metadata("design:type", task_service_1.TaskService)
], TaskController.prototype, "service", void 0);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)("/"),
    (0, routing_controllers_openapi_1.ResponseSchema)(tasks_1.Task, { isArray: true }),
    tslib_1.__param(0, (0, routing_controllers_1.QueryParam)("status")),
    tslib_1.__param(1, (0, routing_controllers_1.QueryParam)("q")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "list", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)("/:id"),
    (0, routing_controllers_openapi_1.ResponseSchema)(tasks_1.Task),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("id")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "get", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Post)("/"),
    (0, routing_controllers_openapi_1.ResponseSchema)(tasks_1.Task),
    tslib_1.__param(0, (0, routing_controllers_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [task_dto_1.CreateTaskInput]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "create", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Put)("/:id"),
    (0, routing_controllers_openapi_1.ResponseSchema)(tasks_1.Task),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("id")),
    tslib_1.__param(1, (0, routing_controllers_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, task_dto_1.UpdateTaskInput]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "update", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Delete)("/:id"),
    (0, routing_controllers_1.OnUndefined)(204),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("id")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "remove", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Post)("/:id/assign"),
    (0, routing_controllers_openapi_1.ResponseSchema)(task_submissions_1.TaskSubmission),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("id")),
    tslib_1.__param(1, (0, routing_controllers_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, task_dto_1.AssignTaskInput]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "assign", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)("/submissions"),
    (0, routing_controllers_openapi_1.ResponseSchema)(task_submissions_1.TaskSubmission, { isArray: true }),
    tslib_1.__param(0, (0, routing_controllers_1.QueryParam)("status")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "submissions", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Post)("/submissions/:submissionId/review"),
    (0, routing_controllers_openapi_1.ResponseSchema)(task_submissions_1.TaskSubmission),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("submissionId")),
    tslib_1.__param(1, (0, routing_controllers_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, task_dto_1.ReviewSubmissionInput]),
    tslib_1.__metadata("design:returntype", Promise)
], TaskController.prototype, "review", null);
exports.TaskController = TaskController = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/admin/tasks")
], TaskController);
//# sourceMappingURL=TasksController.js.map