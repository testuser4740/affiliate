"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderDashboard = renderDashboard;
const typeorm_1 = require("typeorm");
const ambassadors_1 = require("../entities/ambassadors");
const affiliate_urls_1 = require("../entities/affiliate-urls");
const commission_history_1 = require("../entities/commission-history");
const activity_logs_1 = require("../entities/activity-logs");
const announcements_1 = require("../entities/announcements");
const base_1 = require("../controllers/base");
async function renderDashboard(req, res) {
    const { ambassadorId, from, to } = req.query;
    const ambassadors = await (0, base_1.getRepo)(ambassadors_1.Ambassador).find({ order: { revenue: "DESC" } });
    const ambassador = ambassadors.find((a) => a.id === ambassadorId) ?? ambassadors[0] ?? null;
    const urls = ambassador
        ? await (0, base_1.getRepo)(affiliate_urls_1.AffiliateUrl).find({ where: { ambassador: ambassador.name }, order: { lastClick: "DESC" } })
        : [];
    const commissionRows = ambassador
        ? await (0, base_1.getRepo)(commission_history_1.CommissionHistory).find({ where: { urlLabel: ambassador.name }, order: { date: "DESC" }, take: 25 })
        : [];
    const where = from && to ? { date: (0, typeorm_1.Between)(new Date(from), new Date(to)) } : {};
    const activity = await (0, base_1.getRepo)(activity_logs_1.ActivityLog).find({ where, order: { date: "ASC" } });
    const announcements = await (0, base_1.getRepo)(announcements_1.Announcement).find({ order: { sentOn: "DESC" }, take: 5 });
    const totals = urls.reduce((acc, u) => {
        acc.clicks += u.clicks ?? 0;
        acc.signups += u.signups ?? 0;
        acc.orders += u.orders ?? 0;
        acc.revenue += Number(u.revenue ?? 0);
        acc.commission += Number(u.commission ?? 0);
        return acc;
    }, { clicks: 0, signups: 0, orders: 0, revenue: 0, commission: 0 });
    const paidCommission = commissionRows
        .filter((c) => c.payoutStatus === "Paid")
        .reduce((s, c) => s + Number(c.commission ?? 0), 0);
    const pendingCommission = totals.commission - paidCommission;
    res.render("dashboard", {
        ambassador,
        ambassadors,
        urls,
        commissionRows,
        activity,
        announcements,
        totals,
        paidCommission,
        pendingCommission,
        selectedId: ambassador?.id ?? "",
        from: from ?? "",
        to: to ?? "",
    });
}
//# sourceMappingURL=dashboard.js.map