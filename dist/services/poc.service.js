"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PocService = void 0;
const typedi_1 = require("typedi");
const data_source_1 = require("../data-source");
const pocs_1 = require("../entities/pocs");
const exceptions_1 = require("../exceptions");
let PocService = class PocService {
    repo() {
        return data_source_1.AppDataSource.getRepository(pocs_1.Poc);
    }
    async list(filter) {
        const where = {};
        if (filter.region)
            where.region = filter.region;
        if (filter.role)
            where.role = filter.role;
        const all = await this.repo().find({ where, order: { name: "ASC" } });
        const data = filter.q
            ? all.filter((p) => `${p.name}${p.role}${p.region}`.toLowerCase().includes(filter.q.toLowerCase()))
            : all;
        return { data, total: data.length };
    }
    async getById(id) {
        const poc = await this.repo().findOne({ where: { id } });
        if (!poc)
            throw new exceptions_1.NotFoundError(`POC ${id} not found`);
        return poc;
    }
    async create(input) {
        if (!input.name?.trim() || !input.role?.trim())
            throw new exceptions_1.NotFoundError("Name and role are required");
        const poc = this.repo().create(input);
        return this.repo().save(poc);
    }
    async update(id, input) {
        const repo = this.repo();
        const poc = await this.getById(id);
        repo.merge(poc, input);
        return repo.save(poc);
    }
    async remove(id) {
        const repo = this.repo();
        const poc = await this.getById(id);
        await repo.remove(poc);
    }
};
exports.PocService = PocService;
exports.PocService = PocService = __decorate([
    (0, typedi_1.Service)()
], PocService);
//# sourceMappingURL=poc.service.js.map