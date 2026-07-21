"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmbassadorService = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const Logger_1 = require("../../decorators/Logger");
const AmbassadorRepository_1 = require("../repositories/AmbassadorRepository");
const errors_1 = require("../errors");
let AmbassadorService = class AmbassadorService {
    constructor(repository, log) {
        this.repository = repository;
        this.log = log;
    }
    async list(filter) {
        const repo = this.repository.repository;
        const where = {};
        if (filter.tier && filter.tier !== "All")
            where.tier = filter.tier;
        if (filter.state && filter.state !== "All States")
            where.state = filter.state;
        if (filter.city && filter.city !== "All Cities")
            where.city = filter.city;
        const all = await repo.find({ where, order: { revenue: "DESC" } });
        const data = filter.q
            ? all.filter((a) => `${a.name}${a.college}${a.city}${a.state}`.toLowerCase().includes(filter.q.toLowerCase()))
            : all;
        return { data, total: data.length };
    }
    async getById(id) {
        const ambassador = await this.repository.repository.findOne({ where: { id } });
        if (!ambassador)
            throw new errors_1.NotFoundError(`Ambassador ${id} not found`);
        return ambassador;
    }
    async update(id, input) {
        const repo = this.repository.repository;
        const ambassador = await this.getById(id);
        repo.merge(ambassador, input);
        return repo.save(ambassador);
    }
    async leaderboard(state) {
        const all = await this.repository.repository.find({ order: { revenue: "DESC" } });
        const data = state ? all.filter((a) => a.state === state) : all;
        return { data, total: data.length };
    }
    async publicLeaderboard(state) {
        const all = await this.repository.repository.find({ order: { revenue: "DESC" } });
        return state ? all.filter((a) => a.state === state) : all;
    }
};
exports.AmbassadorService = AmbassadorService;
exports.AmbassadorService = AmbassadorService = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__param(1, (0, Logger_1.Logger)(__filename)),
    tslib_1.__metadata("design:paramtypes", [AmbassadorRepository_1.AmbassadorRepository, Object])
], AmbassadorService);
//# sourceMappingURL=ambassador.service.js.map