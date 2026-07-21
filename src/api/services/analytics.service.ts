import { Service } from "typedi";
import { Between } from "typeorm";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { ActivityLog } from "../models/activity-logs";
import { AffiliateUrl } from "../models/affiliate-urls";
import { CommissionHistory } from "../models/commission-history";
import { ActivityRepository } from "../repositories/ActivityRepository";
import { AffiliateUrlRepository } from "../repositories/AffiliateUrlRepository";
import { CommissionHistoryRepository } from "../repositories/CommissionHistoryRepository";

@Service()
export class AnalyticsService {
  constructor(
    private activityRepository: ActivityRepository,
    private affiliateUrlRepository: AffiliateUrlRepository,
    private commissionHistoryRepository: CommissionHistoryRepository,
    @Logger(__filename) private log: LoggerInterface,
  ) {}

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

  async activity(from?: string, to?: string) {
    const where = from && to ? { date: Between(new Date(from), new Date(to)) } : {};
    return this.activityRepository.repository.find({ where, order: { date: "ASC" } });
  }
}
