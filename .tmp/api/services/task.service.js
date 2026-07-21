"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const Logger_1 = require("../../decorators/Logger");
const TaskRepository_1 = require("../repositories/TaskRepository");
const TaskSubmissionRepository_1 = require("../repositories/TaskSubmissionRepository");
const errors_1 = require("../errors");
let TaskService = class TaskService {
    constructor(taskRepository, submissionRepository, log) {
        this.taskRepository = taskRepository;
        this.submissionRepository = submissionRepository;
        this.log = log;
    }
    repo() {
        return this.taskRepository.repository;
    }
    subRepo() {
        return this.submissionRepository.repository;
    }
    async list(filter) {
        const where = {};
        if (filter.status && filter.status !== "All")
            where.status = filter.status;
        const all = await this.repo().find({ where, order: { deadline: "ASC" } });
        const data = filter.q
            ? all.filter((t) => `${t.id}${t.title}${t.description}`.toLowerCase().includes(filter.q.toLowerCase()))
            : all;
        return { data, total: data.length };
    }
    async getById(id) {
        const task = await this.repo().findOne({ where: { id } });
        if (!task)
            throw new errors_1.NotFoundError(`Task ${id} not found`);
        return task;
    }
    async create(input) {
        if (!input.title?.trim())
            throw new errors_1.NotFoundError("Title is required");
        const task = this.repo().create({
            title: input.title,
            description: input.description,
            deadline: input.deadline ? new Date(input.deadline) : undefined,
            reward: input.reward ?? 0,
            status: input.status ?? "Active",
        });
        return this.repo().save(task);
    }
    async update(id, input) {
        const repo = this.repo();
        const task = await this.getById(id);
        repo.merge(task, input);
        return repo.save(task);
    }
    async remove(id) {
        const repo = this.repo();
        const task = await this.getById(id);
        await repo.remove(task);
    }
    async assign(id, input) {
        const task = await this.getById(id);
        const submission = this.subRepo().create({
            submissionId: `TS-${Date.now()}`,
            ambassador: input.ambassador,
            college: input.college,
            task: task.title,
            status: "Pending Review",
        });
        const saved = await this.subRepo().save(submission);
        task.assignedCount = (task.assignedCount ?? 0) + 1;
        await this.repo().save(task);
        return saved;
    }
    async submissions(status) {
        const where = {};
        if (status)
            where.status = status;
        const data = await this.subRepo().find({ where, order: { createdAt: "DESC" } });
        return { data, total: data.length };
    }
    async updateSubmission(submission) {
        return this.subRepo().save(submission);
    }
    async review(submissionId, input) {
        const repo = this.subRepo();
        const submission = await repo.findOne({ where: { submissionId } });
        if (!submission)
            throw new errors_1.NotFoundError(`Submission ${submissionId} not found`);
        submission.status = input.status;
        if (input.rejectReason)
            submission.rejectReason = input.rejectReason;
        const saved = await repo.save(submission);
        if (input.status === "Approved") {
            const task = await this.repo().findOne({ where: { title: submission.task } });
            if (task) {
                task.completedCount = (task.completedCount ?? 0) + 1;
                await this.repo().save(task);
            }
        }
        return saved;
    }
};
exports.TaskService = TaskService;
exports.TaskService = TaskService = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__param(2, (0, Logger_1.Logger)(__filename)),
    tslib_1.__metadata("design:paramtypes", [TaskRepository_1.TaskRepository,
        TaskSubmissionRepository_1.TaskSubmissionRepository, Object])
], TaskService);
//# sourceMappingURL=task.service.js.map