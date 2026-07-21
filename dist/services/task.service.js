"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const typedi_1 = require("typedi");
const data_source_1 = require("../data-source");
const tasks_1 = require("../entities/tasks");
const task_submissions_1 = require("../entities/task-submissions");
const exceptions_1 = require("../exceptions");
let TaskService = class TaskService {
    repo() {
        return data_source_1.AppDataSource.getRepository(tasks_1.Task);
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
            throw new exceptions_1.NotFoundError(`Task ${id} not found`);
        return task;
    }
    async create(input) {
        if (!input.title?.trim())
            throw new exceptions_1.NotFoundError("Title is required");
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
        const subRepo = data_source_1.AppDataSource.getRepository(task_submissions_1.TaskSubmission);
        const submission = subRepo.create({
            submissionId: `TS-${Date.now()}`,
            ambassador: input.ambassador,
            college: input.college,
            task: task.title,
            status: "Pending Review",
        });
        const saved = await subRepo.save(submission);
        task.assignedCount = (task.assignedCount ?? 0) + 1;
        await this.repo().save(task);
        return saved;
    }
    async submissions(status) {
        const where = {};
        if (status)
            where.status = status;
        const data = await data_source_1.AppDataSource.getRepository(task_submissions_1.TaskSubmission).find({
            where,
            order: { createdAt: "DESC" },
        });
        return { data, total: data.length };
    }
    async review(submissionId, input) {
        const repo = data_source_1.AppDataSource.getRepository(task_submissions_1.TaskSubmission);
        const submission = await repo.findOne({ where: { submissionId } });
        if (!submission)
            throw new exceptions_1.NotFoundError(`Submission ${submissionId} not found`);
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
exports.TaskService = TaskService = __decorate([
    (0, typedi_1.Service)()
], TaskService);
//# sourceMappingURL=task.service.js.map