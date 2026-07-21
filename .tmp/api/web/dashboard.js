"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderDashboard = renderDashboard;
const typeorm_1 = require("typeorm");
const AmbassadorRepository_1 = require("../repositories/AmbassadorRepository");
const AffiliateUrlRepository_1 = require("../repositories/AffiliateUrlRepository");
const CommissionHistoryRepository_1 = require("../repositories/CommissionHistoryRepository");
const ActivityRepository_1 = require("../repositories/ActivityRepository");
const AnnouncementRepository_1 = require("../repositories/AnnouncementRepository");
async function renderDashboard(req, res) {
    const { ambassadorId, from, to } = req.query;
    const ambassadorRepo = new AmbassadorRepository_1.AmbassadorRepository();
    const urlRepo = new AffiliateUrlRepository_1.AffiliateUrlRepository();
    const commissionRepo = new CommissionHistoryRepository_1.CommissionHistoryRepository();
    const activityRepo = new ActivityRepository_1.ActivityRepository();
    const announcementRepo = new AnnouncementRepository_1.AnnouncementRepository();
    const ambassadors = await ambassadorRepo.repository.find({ order: { revenue: "DESC" } });
    const ambassador = ambassadors.find((a) => a.id === ambassadorId) ?? ambassadors[0] ?? null;
    const urls = ambassador
        ? await urlRepo.repository.find({ where: { ambassador: ambassador.name }, order: { lastClick: "DESC" } })
        : [];
    const commissionRows = ambassador
        ? await commissionRepo.repository.find({ where: { urlLabel: ambassador.name }, order: { date: "DESC" }, take: 25 })
        : [];
    const where = from && to ? { date: (0, typeorm_1.Between)(new Date(from), new Date(to)) } : {};
    const activity = await activityRepo.repository.find({ where, order: { date: "ASC" } });
    const announcements = await announcementRepo.repository.find({ order: { sentOn: "DESC" }, take: 5 });
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