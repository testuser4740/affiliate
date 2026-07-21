"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const Logger_1 = require("../../decorators/Logger");
const AmbassadorRepository_1 = require("../repositories/AmbassadorRepository");
const AffiliateUrlRepository_1 = require("../repositories/AffiliateUrlRepository");
const CommissionHistoryRepository_1 = require("../repositories/CommissionHistoryRepository");
const errors_1 = require("../errors");
let DashboardService = class DashboardService {
    constructor(ambassadorRepository, affiliateUrlRepository, commissionHistoryRepository, log) {
        this.ambassadorRepository = ambassadorRepository;
        this.affiliateUrlRepository = affiliateUrlRepository;
        this.commissionHistoryRepository = commissionHistoryRepository;
        this.log = log;
    }
    async home(ambassadorId) {
        const ambassador = await this.ambassadorRepository.repository.findOne({ where: { id: ambassadorId } });
        if (!ambassador)
            throw new errors_1.NotFoundError(`Ambassador ${ambassadorId} not found`);
        const urls = await this.affiliateUrlRepository.repository.find({
            where: { ambassador: ambassador.name },
            order: { lastClick: "DESC" },
        });
        const history = await this.commissionHistoryRepository.repository.find({
            where: { urlLabel: ambassador.name },
            order: { date: "DESC" },
            take: 5,
        });
        const totals = urls.reduce((acc, u) => {
            acc.clicks += u.clicks ?? 0;
            acc.signups += u.signups ?? 0;
            acc.orders += u.orders ?? 0;
            acc.revenue += Number(u.revenue ?? 0);
            acc.commission += Number(u.commission ?? 0);
            return acc;
        }, { clicks: 0, signups: 0, orders: 0, revenue: 0, commission: 0 });
        return { ambassador, stats: totals, urls, recentOrders: history };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__param(3, (0, Logger_1.Logger)(__filename)),
    tslib_1.__metadata("design:paramtypes", [AmbassadorRepository_1.AmbassadorRepository,
        AffiliateUrlRepository_1.AffiliateUrlRepository,
        CommissionHistoryRepository_1.CommissionHistoryRepository, Object])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map