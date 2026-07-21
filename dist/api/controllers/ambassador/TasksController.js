"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmbassadorTaskController = void 0;
const tslib_1 = require("tslib");
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const tasks_1 = require("../../models/tasks");
const task_submissions_1 = require("../../models/task-submissions");
const task_service_1 = require("../../services/task.service");
const ambassador_service_1 = require("../../services/ambassador.service");
let AmbassadorTaskController = class AmbassadorTaskController {
    constructor(taskService, ambassadorService) {
        this.taskService = taskService;
        this.ambassadorService = ambassadorService;
    }
    async tasks(_ambassadorId, status) {
        const { data } = await this.taskService.list({ status });
        return data;
    }
    async mySubmissions(ambassadorId) {
        const { data } = await this.taskService.submissions();
        return data.filter((s) => s.ambassador === ambassadorId);
    }
    async submitTask(ambassadorId, taskId, body) {
        await this.ambassadorService.getById(ambassadorId);
        const task = await this.taskService.getById(taskId);
        const { data: allSubs } = await this.taskService.submissions();
        const existing = allSubs.find((s) => s.ambassador === ambassadorId && s.task === task.title && s.status === "Pending Review");
        if (existing) {
            existing.proof = body.proof ?? existing.proof;
            return this.taskService.updateSubmission(existing);
        }
        return this.taskService.assign(taskId, {
            ambassador: ambassadorId,
            college: body.college,
        });
    }
};
exports.AmbassadorTaskController = AmbassadorTaskController;
tslib_1.__decorate([
    (0, routing_controllers_1.Get)("/:ambassadorId/tasks"),
    (0, routing_controllers_openapi_1.ResponseSchema)(tasks_1.Task, { isArray: true }),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("ambassadorId")),
    tslib_1.__param(1, (0, routing_controllers_1.QueryParam)("status")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], AmbassadorTaskController.prototype, "tasks", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)("/:ambassadorId/tasks/submissions"),
    (0, routing_controllers_openapi_1.ResponseSchema)(task_submissions_1.TaskSubmission, { isArray: true }),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("ambassadorId")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AmbassadorTaskController.prototype, "mySubmissions", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Post)("/:ambassadorId/tasks/:taskId/submit"),
    (0, routing_controllers_openapi_1.ResponseSchema)(task_submissions_1.TaskSubmission),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("ambassadorId")),
    tslib_1.__param(1, (0, routing_controllers_1.Param)("taskId")),
    tslib_1.__param(2, (0, routing_controllers_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AmbassadorTaskController.prototype, "submitTask", null);
exports.AmbassadorTaskController = AmbassadorTaskController = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/ambassador"),
    tslib_1.__metadata("design:paramtypes", [task_service_1.TaskService,
        ambassador_service_1.AmbassadorService])
], AmbassadorTaskController);
//# sourceMappingURL=TasksController.js.map