"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionService = void 0;
const typedi_1 = require("typedi");
const data_source_1 = require("../data-source");
const commission_history_1 = require("../entities/commission-history");
const commission_overrides_1 = require("../entities/commission-overrides");
let CommissionService = class CommissionService {
    repo() {
        return data_source_1.AppDataSource.getRepository(commission_history_1.CommissionHistory);
    }
    async history(urlLabel) {
        const where = {};
        if (urlLabel)
            where.urlLabel = urlLabel;
        return this.repo().find({ where, order: { date: "DESC" } });
    }
    async calculate(input, ambassador) {
        const pct = this.effectiveRate(ambassador);
        const commission = (pct / 100) * input.orderValue;
        const record = this.repo().create({
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
        return this.repo().save(record);
    }
    async markPaid(id) {
        const record = await this.repo().findOne({ where: { id } });
        if (!record)
            throw new Error(`Commission ${id} not found`);
        record.payoutStatus = "Paid";
        return this.repo().save(record);
    }
    effectiveRate(ambassador) {
        if (!ambassador)
            return 5;
        const override = data_source_1.AppDataSource.getRepository(commission_overrides_1.CommissionOverride).findOne({
            where: { appliesTo: ambassador.tier, status: "Active" },
        });
        void override;
        return ambassador.commissionPct || 5;
    }
};
exports.CommissionService = CommissionService;
exports.CommissionService = CommissionService = __decorate([
    (0, typedi_1.Service)()
], CommissionService);
//# sourceMappingURL=commission.service.js.map