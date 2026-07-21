"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TierService = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const Logger_1 = require("../../decorators/Logger");
const TierRepository_1 = require("../repositories/TierRepository");
let TierService = class TierService {
    constructor(repository, log) {
        this.repository = repository;
        this.log = log;
    }
    async list() {
        return this.repository.repository.find({ order: { min: "ASC" } });
    }
    async getByName(name) {
        return this.repository.repository.findOne({ where: { name } });
    }
    resolveProgression(revenue, tiers) {
        const matched = tiers.find((t) => Number(t.min) <= revenue && revenue <= Number(t.max));
        const current = matched ?? tiers[0];
        const next = tiers.find((t) => Number(t.min) > revenue) ?? null;
        const revenueNum = Number(revenue ?? 0);
        const progress = current
            ? Math.min(100, Math.round(((revenueNum - Number(current.min)) /
                (Number(current.max) - Number(current.min) || 1)) *
                100))
            : 0;
        return { current, next, progressToNext: next ? progress : 100, allTiers: tiers };
    }
};
exports.TierService = TierService;
exports.TierService = TierService = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__param(1, (0, Logger_1.Logger)(__filename)),
    tslib_1.__metadata("design:paramtypes", [TierRepository_1.TierRepository, Object])
], TierService);
//# sourceMappingURL=tier.service.js.map