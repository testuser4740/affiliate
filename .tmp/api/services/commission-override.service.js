"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionOverrideService = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const Logger_1 = require("../../decorators/Logger");
const CommissionOverrideRepository_1 = require("../repositories/CommissionOverrideRepository");
const errors_1 = require("../errors");
let CommissionOverrideService = class CommissionOverrideService {
    constructor(repository, log) {
        this.repository = repository;
        this.log = log;
    }
    async list(filter) {
        const repo = this.repository.repository;
        const where = {};
        if (filter.status && filter.status !== "All statuses")
            where.status = filter.status;
        const all = await repo.find({ where, order: { startDate: "DESC" } });
        const data = filter.q
            ? all.filter((o) => `${o.id}${o.label}${o.appliesTo}`.toLowerCase().includes(filter.q.toLowerCase()))
            : all;
        return { data, total: data.length };
    }
    async getById(id) {
        const override = await this.repository.repository.findOne({ where: { id } });
        if (!override)
            throw new errors_1.NotFoundError(`Override ${id} not found`);
        return override;
    }
    async create(input) {
        if (!input.label?.trim())
            throw new errors_1.NotFoundError("Campaign label is required");
        const override = this.repository.repository.create({
            label: input.label,
            appliesTo: input.appliesTo,
            overridePct: input.overridePct ?? 0,
            originalPct: input.originalPct ?? 0,
            startDate: input.startDate ? new Date(input.startDate) : undefined,
            endDate: input.endDate ? new Date(input.endDate) : undefined,
            status: input.status ?? "Scheduled",
        });
        return this.repository.repository.save(override);
    }
    async update(id, input) {
        const repo = this.repository.repository;
        const override = await this.getById(id);
        repo.merge(override, input);
        return repo.save(override);
    }
    async remove(id) {
        const repo = this.repository.repository;
        const override = await this.getById(id);
        await repo.remove(override);
    }
};
exports.CommissionOverrideService = CommissionOverrideService;
exports.CommissionOverrideService = CommissionOverrideService = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__param(1, (0, Logger_1.Logger)(__filename)),
    tslib_1.__metadata("design:paramtypes", [CommissionOverrideRepository_1.CommissionOverrideRepository, Object])
], CommissionOverrideService);
//# sourceMappingURL=commission-override.service.js.map