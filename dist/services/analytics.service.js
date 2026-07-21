"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const typedi_1 = require("typedi");
const typeorm_1 = require("typeorm");
const data_source_1 = require("../data-source");
const activity_logs_1 = require("../entities/activity-logs");
const affiliate_urls_1 = require("../entities/affiliate-urls");
const commission_history_1 = require("../entities/commission-history");
let AnalyticsService = class AnalyticsService {
    async kpis() {
        const urls = await data_source_1.AppDataSource.getRepository(affiliate_urls_1.AffiliateUrl).find();
        const commission = await data_source_1.AppDataSource.getRepository(commission_history_1.CommissionHistory).find();
        const logs = await data_source_1.AppDataSource.getRepository(activity_logs_1.ActivityLog).find({ order: { date: "DESC" } });
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
        return data_source_1.AppDataSource.getRepository(activity_logs_1.ActivityLog).find({ order: { date: "ASC" } });
    }
    async activity(from, to) {
        const where = from && to ? { date: (0, typeorm_1.Between)(new Date(from), new Date(to)) } : {};
        return data_source_1.AppDataSource.getRepository(activity_logs_1.ActivityLog).find({ where, order: { date: "ASC" } });
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, typedi_1.Service)()
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map