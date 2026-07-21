"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmbassadorService = void 0;
const typedi_1 = require("typedi");
const data_source_1 = require("../data-source");
const ambassadors_1 = require("../entities/ambassadors");
const exceptions_1 = require("../exceptions");
let AmbassadorService = class AmbassadorService {
    repo() {
        return data_source_1.AppDataSource.getRepository(ambassadors_1.Ambassador);
    }
    async list(filter) {
        const where = {};
        if (filter.tier && filter.tier !== "All")
            where.tier = filter.tier;
        if (filter.state && filter.state !== "All States")
            where.state = filter.state;
        if (filter.city && filter.city !== "All Cities")
            where.city = filter.city;
        const all = await this.repo().find({ where, order: { revenue: "DESC" } });
        const data = filter.q
            ? all.filter((a) => `${a.name}${a.college}${a.city}${a.state}`.toLowerCase().includes(filter.q.toLowerCase()))
            : all;
        return { data, total: data.length };
    }
    async getById(id) {
        const ambassador = await this.repo().findOne({ where: { id } });
        if (!ambassador)
            throw new exceptions_1.NotFoundError(`Ambassador ${id} not found`);
        return ambassador;
    }
    async update(id, input) {
        const repo = this.repo();
        const ambassador = await this.getById(id);
        repo.merge(ambassador, input);
        return repo.save(ambassador);
    }
    async leaderboard(state) {
        const all = await this.repo().find({ order: { revenue: "DESC" } });
        const data = state ? all.filter((a) => a.state === state) : all;
        return { data, total: data.length };
    }
    async publicLeaderboard(state) {
        const all = await this.repo().find({ order: { revenue: "DESC" } });
        return state ? all.filter((a) => a.state === state) : all;
    }
};
exports.AmbassadorService = AmbassadorService;
exports.AmbassadorService = AmbassadorService = __decorate([
    (0, typedi_1.Service)()
], AmbassadorService);
//# sourceMappingURL=ambassador.service.js.map