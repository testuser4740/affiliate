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
exports.AmbassadorTaskController = void 0;
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const tasks_1 = require("../../entities/tasks");
const task_submissions_1 = require("../../entities/task-submissions");
const task_service_1 = require("../../services/task.service");
const ambassador_service_1 = require("../../services/ambassador.service");
const data_source_1 = require("../../data-source");
let AmbassadorTaskController = class AmbassadorTaskController {
    /**
     * @openapi
     * /ambassador/{ambassadorId}/tasks:
     *   get:
     *     tags: [Ambassador / Tasks]
     *     summary: Tasks available to the ambassador
     */
    async tasks(_ambassadorId, status) {
        const { data } = await this.taskService.list({ status });
        return data;
    }
    async mySubmissions(ambassadorId) {
        const { data } = await this.taskService.submissions();
        return data.filter((s) => s.ambassador === ambassadorId);
    }
    /**
     * @openapi
     * /ambassador/{ambassadorId}/tasks/{taskId}/submit:
     *   post:
     *     tags: [Ambassador / Tasks]
     *     summary: Submit / resubmit proof for a task
     */
    async submitTask(ambassadorId, taskId, body) {
        await this.ambassadorService.getById(ambassadorId);
        const task = await this.taskService.getById(taskId);
        const { data: allSubs } = await this.taskService.submissions();
        const existing = allSubs.find((s) => s.ambassador === ambassadorId && s.task === task.title && s.status === "Pending Review");
        if (existing) {
            existing.proof = body.proof ?? existing.proof;
            const repo = data_source_1.AppDataSource.getRepository(task_submissions_1.TaskSubmission);
            return repo.save(existing);
        }
        return this.taskService.assign(taskId, {
            ambassador: ambassadorId,
            college: body.college,
        });
    }
};
exports.AmbassadorTaskController = AmbassadorTaskController;
__decorate([
    (0, typedi_1.Inject)(),
    __metadata("design:type", task_service_1.TaskService)
], AmbassadorTaskController.prototype, "taskService", void 0);
__decorate([
    (0, typedi_1.Inject)(),
    __metadata("design:type", ambassador_service_1.AmbassadorService)
], AmbassadorTaskController.prototype, "ambassadorService", void 0);
__decorate([
    (0, routing_controllers_1.Get)("/:ambassadorId/tasks"),
    (0, routing_controllers_openapi_1.ResponseSchema)(tasks_1.Task, { isArray: true }),
    __param(0, (0, routing_controllers_1.Param)("ambassadorId")),
    __param(1, (0, routing_controllers_1.QueryParam)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AmbassadorTaskController.prototype, "tasks", null);
__decorate([
    (0, routing_controllers_1.Get)("/:ambassadorId/tasks/submissions"),
    (0, routing_controllers_openapi_1.ResponseSchema)(task_submissions_1.TaskSubmission, { isArray: true }),
    __param(0, (0, routing_controllers_1.Param)("ambassadorId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AmbassadorTaskController.prototype, "mySubmissions", null);
__decorate([
    (0, routing_controllers_1.Post)("/:ambassadorId/tasks/:taskId/submit"),
    (0, routing_controllers_openapi_1.ResponseSchema)(task_submissions_1.TaskSubmission),
    __param(0, (0, routing_controllers_1.Param)("ambassadorId")),
    __param(1, (0, routing_controllers_1.Param)("taskId")),
    __param(2, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AmbassadorTaskController.prototype, "submitTask", null);
exports.AmbassadorTaskController = AmbassadorTaskController = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/ambassador")
], AmbassadorTaskController);
//# sourceMappingURL=tasks.js.map