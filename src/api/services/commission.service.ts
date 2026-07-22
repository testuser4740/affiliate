import { Service } from "typedi";
import { LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { CommissionHistory } from "../models/commission-history";
import { Ambassador, resolveTier } from "../models/ambassadors";
import { AmbassadorRepository } from "../repositories/AmbassadorRepository";
import { TierRepository } from "../repositories/TierRepository";
import { CommissionHistoryRepository } from "../repositories/CommissionHistoryRepository";
import { CommissionOverrideRepository } from "../repositories/CommissionOverrideRepository";
import { liveBus } from "../lib/eventBus";

export interface CommissionInput {
  id: string;
  date: string;
  product: string;
  category: string;
  urlLabel?: string;
  ambassadorId?: string;
  orderValue: number;
  payoutStatus?: string;
}

@Service()
export class CommissionService {
  constructor(
    private commissionHistoryRepository: CommissionHistoryRepository,
    private commissionOverrideRepository: CommissionOverrideRepository,
    private ambassadorRepository: AmbassadorRepository,
    private tierRepository: TierRepository,
    @Logger(__filename) private log: LoggerInterface,
  ) {}

  async history(urlLabel?: string): Promise<CommissionHistory[]> {
    const where: Record<string, unknown> = {};
    if (urlLabel) where.urlLabel = urlLabel;
    return this.commissionHistoryRepository.repository.find({ where, order: { date: "DESC" } });
  }

  async calculate(input: CommissionInput, ambassador?: Ambassador): Promise<CommissionHistory> {
    // Resolve the effective commission rate (override > first-order > tier-based).
    const pct = await this.effectiveRate(ambassador);
    const commission = (pct / 100) * input.orderValue;

    const record = this.commissionHistoryRepository.repository.create({
      id: input.id,
      date: input.date,
      product: input.product,
      category: input.category,
      urlLabel: input.urlLabel,
      ambassadorId: input.ambassadorId ?? null,
      orderValue: input.orderValue,
      commissionPct: pct,
      commission,
      status: "Placed",
      payoutStatus: input.payoutStatus ?? "Pending",
    } as Partial<CommissionHistory>);
    const saved = await this.commissionHistoryRepository.repository.save(record);

    // Auto-update ambassador rollups (revenue, orders, tier, commissionPct).
    if (input.ambassadorId) {
      await this.updateAmbassadorStats(input.ambassadorId, input.orderValue);
    }

    liveBus.broadcast({ type: "orders" });
    liveBus.broadcast({ type: "commission" });
    liveBus.broadcast({ type: "leaderboard" });
    return saved;
  }

  async markPaid(id: string): Promise<CommissionHistory> {
    const record = await this.commissionHistoryRepository.repository.findOne({ where: { id } });
    if (!record) throw new Error(`Commission ${id} not found`);
    record.payoutStatus = "Paid";
    return this.commissionHistoryRepository.repository.save(record);
  }

  /**
   * Effective commission % for an ambassador, applied in priority order:
   *   1. An ACTIVE override for the ambassador's tier that is within its date window.
   *   2. First-order rate (5%) if the ambassador has never ordered.
   *   3. Tier-based default (Bronze 8, Silver 10, Gold 12, Platinum 15).
   */
  async effectiveRate(ambassador?: Ambassador): Promise<number> {
    if (!ambassador) return 5;

    const tierName = ambassador.tier?.name ?? "Bronze";
    const override = await this.activeOverrideFor(tierName);
    if (override) return Number(override.overridePct);

    // First order gets a flat 5% introductory rate.
    if ((ambassador.orders ?? 0) === 0) return 5;

    return resolveTier(Number(ambassador.revenue ?? 0)).commission;
  }

  /** Finds a currently-valid override for a tier based on date window. */
  private async activeOverrideFor(tierName: string) {
    const now = new Date();
    const overrides = await this.commissionOverrideRepository.repository.find({
      where: { appliesTo: tierName },
      order: { startDate: "DESC" },
    });

    let activeOverride = null;
    for (const override of overrides) {
      const start = new Date(override.startDate);
      const end = new Date(override.endDate);
      if (now < start) {
        if (override.status !== "Scheduled") {
          override.status = "Scheduled";
          await this.commissionOverrideRepository.repository.save(override);
        }
        activeOverride = override;
        break;
      } else if (now >= start && now <= end) {
        if (override.status !== "Active") {
          override.status = "Active";
          await this.commissionOverrideRepository.repository.save(override);
        }
        activeOverride = override;
        break;
      } else {
        if (override.status !== "Expired") {
          override.status = "Expired";
          await this.commissionOverrideRepository.repository.save(override);
        }
      }
    }

    return activeOverride;
  }

  /** Recomputes revenue, orders, tier FK and commissionPct for an ambassador. */
  async updateAmbassadorStats(ambassadorId: string, orderValue: number): Promise<void> {
    const ambassador = await this.ambassadorRepository.repository.findOne({
      where: { id: ambassadorId },
      relations: ["tier"],
    });
    if (!ambassador) return;

    ambassador.revenue = Number(ambassador.revenue ?? 0) + Number(orderValue);
    ambassador.orders = (ambassador.orders ?? 0) + 1;

    // Recompute tier from the new revenue and relink the FK.
    const tierInfo = resolveTier(ambassador.revenue);
    const tierRecord = await this.tierRepository.repository.findOne({ where: { name: tierInfo.level } });
    ambassador.tier = tierRecord ?? null;

    // commissionPct on the ambassador reflects the effective rate going forward.
    ambassador.commissionPct = await this.effectiveRate(ambassador);

    await this.ambassadorRepository.repository.save(ambassador);
    await this.recomputeRanks();

    this.log.info(
      `Ambassador ${ambassadorId}: revenue=${ambassador.revenue}, orders=${ambassador.orders}, tier=${tierInfo.level}, commissionPct=${ambassador.commissionPct}`,
    );
  }

  /** Reassigns ranks 1..N by revenue DESC. */
  async recomputeRanks(): Promise<void> {
    const all = await this.ambassadorRepository.repository.find({ order: { revenue: "DESC" } });
    let rank = 1;
    for (const a of all) {
      if (a.rank !== rank) {
        a.rank = rank;
        await this.ambassadorRepository.repository.save(a);
      }
      rank += 1;
    }
  }
}