"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const typeorm_1 = require("typeorm");
const Logger_1 = require("../../decorators/Logger");
const ActivityRepository_1 = require("../repositories/ActivityRepository");
const AffiliateUrlRepository_1 = require("../repositories/AffiliateUrlRepository");
const CommissionHistoryRepository_1 = require("../repositories/CommissionHistoryRepository");
let AnalyticsService = class AnalyticsService {
    constructor(activityRepository, affiliateUrlRepository, commissionHistoryRepository, log) {
        this.activityRepository = activityRepository;
        this.affiliateUrlRepository = affiliateUrlRepository;
        this.commissionHistoryRepository = commissionHistoryRepository;
        this.log = log;
    }
    async kpis() {
        const urls = await this.affiliateUrlRepository.repository.find();
        const commission = await this.commissionHistoryRepository.repository.find();
        const logs = await this.activityRepository.repository.find({ order: { date: "DESC" } });
        const totalClicks = logs.reduce((s, l) => s + (l.clicks ?? 0), 0);
        const totalSignups = logs.reduce((s, l) => s + (l.signups ?? 0), 0);
        const totalOrders = logs.reduce((s, l) => s + (l.orders ?? 0), 0);
        const totalGMV = logs.reduce((s, l) => s + Number(l.revenue ?? 0), 0);
        const urlRevenue = urls.reduce((s, u) => s + Number(u.revenue ?? 0), 0);
        const urlCommission = urls.reduce((s, u) => s + Number(u.commission ?? 0), 0);
        const totalCommission = commission.reduce((s, c) => s + Number(c.commission ?? 0), 0) + urlCommission;
        const paidCommission = commission
            .filter((c) => c.payoutStatus === "Paid")
            .reduce((s, c) => s + Number(c.commission ?? 0), 0);
        return {
            totalAmbassadors: urls.length,
            totalOrders: commission.length,
            totalClicks,
            totalSignups,
            totalOrdersLogged: totalOrders,
            totalGMV: totalGMV || urlRevenue,
            totalCommission,
            totalCommissionPaid: paidCommission,
            conversionWithRef: totalClicks ? (totalOrders / totalClicks) * 100 : 0,
        };
    }
    async trend() {
        return this.activityRepository.repository.find({ order: { date: "ASC" } });
    }
    async activity(from, to) {
        const where = from && to ? { date: (0, typeorm_1.Between)(new Date(from), new Date(to)) } : {};
        return this.activityRepository.repository.find({ where, order: { date: "ASC" } });
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__param(3, (0, Logger_1.Logger)(__filename)),
    tslib_1.__metadata("design:paramtypes", [ActivityRepository_1.ActivityRepository,
        AffiliateUrlRepository_1.AffiliateUrlRepository,
        CommissionHistoryRepository_1.CommissionHistoryRepository, Object])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map