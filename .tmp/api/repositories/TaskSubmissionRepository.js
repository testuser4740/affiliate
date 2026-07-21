"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskSubmissionRepository = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const task_submissions_1 = require("../models/task-submissions");
const typeormLoader_1 = require("../../loaders/typeormLoader");
let TaskSubmissionRepository = class TaskSubmissionRepository {
    constructor() {
        this.repository = (0, typeormLoader_1.getConnection)().getRepository(task_submissions_1.TaskSubmission);
    }
};
exports.TaskSubmissionRepository = TaskSubmissionRepository;
exports.TaskSubmissionRepository = TaskSubmissionRepository = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__metadata("design:paramtypes", [])
], TaskSubmissionRepository);
//# sourceMappingURL=TaskSubmissionRepository.js.map