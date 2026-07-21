"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PocService = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const Logger_1 = require("../../decorators/Logger");
const PocRepository_1 = require("../repositories/PocRepository");
const errors_1 = require("../errors");
let PocService = class PocService {
    constructor(repository, log) {
        this.repository = repository;
        this.log = log;
    }
    async list(filter) {
        const repo = this.repository.repository;
        const where = {};
        if (filter.region)
            where.region = filter.region;
        if (filter.role)
            where.role = filter.role;
        const all = await repo.find({ where, order: { name: "ASC" } });
        const data = filter.q
            ? all.filter((p) => `${p.name}${p.role}${p.region}`.toLowerCase().includes(filter.q.toLowerCase()))
            : all;
        return { data, total: data.length };
    }
    async getById(id) {
        const poc = await this.repository.repository.findOne({ where: { id } });
        if (!poc)
            throw new errors_1.NotFoundError(`POC ${id} not found`);
        return poc;
    }
    async create(input) {
        if (!input.name?.trim() || !input.role?.trim())
            throw new errors_1.NotFoundError("Name and role are required");
        const poc = this.repository.repository.create(input);
        return this.repository.repository.save(poc);
    }
    async update(id, input) {
        const repo = this.repository.repository;
        const poc = await this.getById(id);
        repo.merge(poc, input);
        return repo.save(poc);
    }
    async remove(id) {
        const repo = this.repository.repository;
        const poc = await this.getById(id);
        await repo.remove(poc);
    }
};
exports.PocService = PocService;
exports.PocService = PocService = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__param(1, (0, Logger_1.Logger)(__filename)),
    tslib_1.__metadata("design:paramtypes", [PocRepository_1.PocRepository, Object])
], PocService);
//# sourceMappingURL=poc.service.js.map