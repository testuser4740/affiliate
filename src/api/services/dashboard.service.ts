import { Service } from "typedi";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Ambassador } from "../models/ambassadors";
import { AffiliateUrl } from "../models/affiliate-urls";
import { CommissionHistory } from "../models/commission-history";
import { AmbassadorRepository } from "../repositories/AmbassadorRepository";
import { AffiliateUrlRepository } from "../repositories/AffiliateUrlRepository";
import { CommissionHistoryRepository } from "../repositories/CommissionHistoryRepository";
import { NotFoundError } from "../errors";

@Service()
export class DashboardService {
  constructor(
    private ambassadorRepository: AmbassadorRepository,
    private affiliateUrlRepository: AffiliateUrlRepository,
    private commissionHistoryRepository: CommissionHistoryRepository,
    @Logger(__filename) private log: LoggerInterface,
  ) {}

  async home(ambassadorId: string) {
    const ambassador = await this.ambassadorRepository.repository.findOne({ where: { id: ambassadorId } });
    if (!ambassador) throw new NotFoundError(`Ambassador ${ambassadorId} not found`);

    const urls = await this.affiliateUrlRepository.repository.find({
      where: { ambassadorId: ambassadorId },
      order: { lastClick: "DESC" },
    });
    const history = await this.commissionHistoryRepository.repository.find({
      where: { ambassadorId: ambassadorId },
      order: { date: "DESC" },
      take: 5,
    });

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

    return { ambassador, stats: totals, urls, recentOrders: history };
  }
}
