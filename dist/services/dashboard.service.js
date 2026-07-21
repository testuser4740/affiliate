"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const typedi_1 = require("typedi");
const data_source_1 = require("../data-source");
const ambassadors_1 = require("../entities/ambassadors");
const affiliate_urls_1 = require("../entities/affiliate-urls");
const commission_history_1 = require("../entities/commission-history");
const exceptions_1 = require("../exceptions");
let DashboardService = class DashboardService {
    ambRepo() {
        return data_source_1.AppDataSource.getRepository(ambassadors_1.Ambassador);
    }
    async home(ambassadorId) {
        const ambassador = await this.ambRepo().findOne({ where: { id: ambassadorId } });
        if (!ambassador)
            throw new exceptions_1.NotFoundError(`Ambassador ${ambassadorId} not found`);
        const urls = await data_source_1.AppDataSource.getRepository(affiliate_urls_1.AffiliateUrl).find({
            where: { ambassador: ambassador.name },
            order: { lastClick: "DESC" },
        });
        const history = await data_source_1.AppDataSource.getRepository(commission_history_1.CommissionHistory).find({
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
exports.DashboardService = DashboardService = __decorate([
    (0, typedi_1.Service)()
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map