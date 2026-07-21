import { Request, Response } from "express";
import { Between } from "typeorm";
import { Ambassador } from "../models/ambassadors";
import { AffiliateUrl } from "../models/affiliate-urls";
import { CommissionHistory } from "../models/commission-history";
import { ActivityLog } from "../models/activity-logs";
import { Announcement } from "../models/announcements";
import { AmbassadorRepository } from "../repositories/AmbassadorRepository";
import { AffiliateUrlRepository } from "../repositories/AffiliateUrlRepository";
import { CommissionHistoryRepository } from "../repositories/CommissionHistoryRepository";
import { ActivityRepository } from "../repositories/ActivityRepository";
import { AnnouncementRepository } from "../repositories/AnnouncementRepository";
import { getConnection } from "../../loaders/typeormLoader";

export async function renderDashboard(req: Request, res: Response): Promise<void> {
  const { ambassadorId, from, to } = req.query as Record<string, string | undefined>;

  const ambassadorRepo = new AmbassadorRepository();
  const urlRepo = new AffiliateUrlRepository();
  const commissionRepo = new CommissionHistoryRepository();
  const activityRepo = new ActivityRepository();
  const announcementRepo = new AnnouncementRepository();

  const ambassadors = await ambassadorRepo.repository.find({ order: { revenue: "DESC" } });
  const ambassador =
    ambassadors.find((a) => a.id === ambassadorId) ?? ambassadors[0] ?? null;

  const urls = ambassador
    ? await urlRepo.repository.find({ where: { ambassadorId: ambassador.id }, order: { lastClick: "DESC" } })
    : [];

  const commissionRows = ambassador
    ? await commissionRepo.repository.find({ where: { ambassadorId: ambassador.id }, order: { date: "DESC" }, take: 25 })
    : [];

  const where = from && to ? { date: Between(new Date(from), new Date(to)) } : {};
  const activity = await activityRepo.repository.find({ where, order: { date: "ASC" } });

  const announcements = await announcementRepo.repository.find({ order: { sentOn: "DESC" }, take: 5 });

  const totals = urls.reduce(
    (acc, u) => {
      acc.clicks += u.clicks ?? 0;
      acc.signups += u.signups ?? 0;
      acc.orders += u.orders ?? 0;
      acc.revenue += Number(u.revenue ?? 0);
      acc.commission += Number(u.commission ?? 0);
      return acc;
    },
    { clicks: 0, signups: 0, orders: 0, revenue: 0, commission: 0 },
  );

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
