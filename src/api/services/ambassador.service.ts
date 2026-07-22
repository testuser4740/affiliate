import { Service } from "typedi";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Ambassador, resolveTier } from "../models/ambassadors";
import { Tier } from "../models/tiers";
import { AmbassadorRepository } from "../repositories/AmbassadorRepository";
import { TierRepository } from "../repositories/TierRepository";
import { CommissionService } from "./commission.service";
import { NotFoundError } from "../errors";
import { UpdateAmbassadorInput } from "../../dto/ambassador.dto";
import { liveBus } from "../lib/eventBus";

export interface AmbassadorFilter {
  tier?: string;
  state?: string;
  city?: string;
  q?: string;
}

@Service()
export class AmbassadorService {
  constructor(
    private repository: AmbassadorRepository,
    private tierRepository: TierRepository,
    private commissionService: CommissionService,
    @Logger(__filename) private log: LoggerInterface,
  ) {}

  async list(filter: AmbassadorFilter): Promise<{ data: Ambassador[]; total: number }> {
    const repo = this.repository.repository;
    const where: Record<string, unknown> = {};
    if (filter.tier && filter.tier !== "All") {
      const tier = await this.tierRepository.repository.findOne({ where: { name: filter.tier } });
      if (tier) where.tierId = tier.id;
    }
    if (filter.state && filter.state !== "All States") where.state = filter.state;
    if (filter.city && filter.city !== "All Cities") where.city = filter.city;
    const all = await repo.find({ where, order: { revenue: "DESC" } });
    const data = filter.q
      ? all.filter((a) =>
          `${a.name}${a.college}${a.city}${a.state}`.toLowerCase().includes(filter.q!.toLowerCase()),
        )
      : all;
    return { data, total: data.length };
  }

  async getById(id: string): Promise<Ambassador> {
    const ambassador = await this.repository.repository.findOne({ 
      where: { id },
      relations: ["tier"]
    });
    if (!ambassador) throw new NotFoundError(`Ambassador ${id} not found`);
    return ambassador;
  }

  async update(id: string, input: UpdateAmbassadorInput): Promise<Ambassador> {
    const repo = this.repository.repository;
    const ambassador = await this.getById(id);
    const { tier: tierName, ...rest } = input;
    if (tierName) {
      const tier = await this.tierRepository.repository.findOne({ where: { name: tierName } });
      if (tier) ambassador.tier = tier;
    }
    repo.merge(ambassador, rest);
    const saved = await repo.save(ambassador);
    liveBus.broadcast({ type: "leaderboard" });
    return saved;
  }

  async recalculateTier(id: string): Promise<Ambassador> {
    const ambassador = await this.getById(id);
    const tierInfo = resolveTier(Number(ambassador.revenue ?? 0));
    const tierRecord = await this.tierRepository.repository.findOne({ where: { name: tierInfo.level } });
    ambassador.tier = tierRecord ?? null;
    ambassador.commissionPct = await this.commissionService.effectiveRate(ambassador);
    return this.repository.repository.save(ambassador);
  }

  async leaderboard(state?: string): Promise<{ data: Ambassador[]; total: number }> {
    const all = await this.repository.repository.find({ order: { revenue: "DESC" } });
    const data = state ? all.filter((a) => a.state === state) : all;
    return { data, total: data.length };
  }

  async publicLeaderboard(state?: string): Promise<Ambassador[]> {
    const all = await this.repository.repository.find({ order: { revenue: "DESC" } });
    return state ? all.filter((a) => a.state === state) : all;
  }
}
