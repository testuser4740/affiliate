"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRepository = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const tasks_1 = require("../models/tasks");
const typeormLoader_1 = require("../../loaders/typeormLoader");
let TaskRepository = class TaskRepository {
    constructor() {
        this.repository = (0, typeormLoader_1.getConnection)().getRepository(tasks_1.Task);
    }
};
exports.TaskRepository = TaskRepository;
exports.TaskRepository = TaskRepository = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__metadata("design:paramtypes", [])
], TaskRepository);
//# sourceMappingURL=TaskRepository.js.map