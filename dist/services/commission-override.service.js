"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionOverrideService = void 0;
const typedi_1 = require("typedi");
const data_source_1 = require("../data-source");
const commission_overrides_1 = require("../entities/commission-overrides");
const exceptions_1 = require("../exceptions");
let CommissionOverrideService = class CommissionOverrideService {
    repo() {
        return data_source_1.AppDataSource.getRepository(commission_overrides_1.CommissionOverride);
    }
    async list(filter) {
        const where = {};
        if (filter.status && filter.status !== "All statuses")
            where.status = filter.status;
        const all = await this.repo().find({ where, order: { startDate: "DESC" } });
        const data = filter.q
            ? all.filter((o) => `${o.id}${o.label}${o.appliesTo}`.toLowerCase().includes(filter.q.toLowerCase()))
            : all;
        return { data, total: data.length };
    }
    async getById(id) {
        const override = await this.repo().findOne({ where: { id } });
        if (!override)
            throw new exceptions_1.NotFoundError(`Override ${id} not found`);
        return override;
    }
    async create(input) {
        if (!input.label?.trim())
            throw new exceptions_1.NotFoundError("Campaign label is required");
        const override = this.repo().create({
            label: input.label,
            appliesTo: input.appliesTo,
            overridePct: input.overridePct ?? 0,
            originalPct: input.originalPct ?? 0,
            startDate: input.startDate ? new Date(input.startDate) : undefined,
            endDate: input.endDate ? new Date(input.endDate) : undefined,
            status: input.status ?? "Scheduled",
        });
        return this.repo().save(override);
    }
    async update(id, input) {
        const repo = this.repo();
        const override = await this.getById(id);
        repo.merge(override, input);
        return repo.save(override);
    }
    async remove(id) {
        const repo = this.repo();
        const override = await this.getById(id);
        await repo.remove(override);
    }
};
exports.CommissionOverrideService = CommissionOverrideService;
exports.CommissionOverrideService = CommissionOverrideService = __decorate([
    (0, typedi_1.Service)()
], CommissionOverrideService);
//# sourceMappingURL=commission-override.service.js.map