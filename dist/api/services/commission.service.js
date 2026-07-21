"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionService = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const Logger_1 = require("../../decorators/Logger");
const CommissionHistoryRepository_1 = require("../repositories/CommissionHistoryRepository");
const CommissionOverrideRepository_1 = require("../repositories/CommissionOverrideRepository");
let CommissionService = class CommissionService {
    constructor(commissionHistoryRepository, commissionOverrideRepository, log) {
        this.commissionHistoryRepository = commissionHistoryRepository;
        this.commissionOverrideRepository = commissionOverrideRepository;
        this.log = log;
    }
    async history(urlLabel) {
        const where = {};
        if (urlLabel)
            where.urlLabel = urlLabel;
        return this.commissionHistoryRepository.repository.find({ where, order: { date: "DESC" } });
    }
    async calculate(input, ambassador) {
        const pct = await this.effectiveRate(ambassador);
        const commission = (pct / 100) * input.orderValue;
        const record = this.commissionHistoryRepository.repository.create({
            id: input.id,
            date: input.date,
            product: input.product,
            category: input.category,
            urlLabel: input.urlLabel,
            orderValue: input.orderValue,
            commissionPct: pct,
            commission,
            status: "Placed",
            payoutStatus: input.payoutStatus ?? "Pending",
        });
        return this.commissionHistoryRepository.repository.save(record);
    }
    async markPaid(id) {
        const record = await this.commissionHistoryRepository.repository.findOne({ where: { id } });
        if (!record)
            throw new Error(`Commission ${id} not found`);
        record.payoutStatus = "Paid";
        return this.commissionHistoryRepository.repository.save(record);
    }
    async effectiveRate(ambassador) {
        if (!ambassador)
            return 5;
        const override = await this.commissionOverrideRepository.repository.findOne({
            where: { appliesTo: ambassador.tier, status: "Active" },
        });
        if (override)
            return override.overridePct;
        return ambassador.commissionPct || 5;
    }
};
exports.CommissionService = CommissionService;
exports.CommissionService = CommissionService = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__param(2, (0, Logger_1.Logger)(__filename)),
    tslib_1.__metadata("design:paramtypes", [CommissionHistoryRepository_1.CommissionHistoryRepository,
        CommissionOverrideRepository_1.CommissionOverrideRepository, Object])
], CommissionService);
//# sourceMappingURL=commission.service.js.map