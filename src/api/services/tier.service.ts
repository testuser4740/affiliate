import { Service } from "typedi";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Tier } from "../models/tiers";
import { TierRepository } from "../repositories/TierRepository";

@Service()
export class TierService {
  constructor(
    private repository: TierRepository,
    @Logger(__filename) private log: LoggerInterface,
  ) {}

  async list(): Promise<Tier[]> {
    return this.repository.repository.find({ order: { min: "ASC" } });
  }

  async getByName(name: string): Promise<Tier | null> {
    return this.repository.repository.findOne({ where: { name } });
  }

  resolveProgression(revenue: number, tiers: Tier[]): {
    current: Tier | undefined;
    next: Tier | null;
    progressToNext: number;
    allTiers: Tier[];
  } {
    const matched = tiers.find((t) => Number(t.min) <= revenue && revenue <= Number(t.max));
    const current = matched ?? tiers[0];
    const next = tiers.find((t) => Number(t.min) > revenue) ?? null;

    const revenueNum = Number(revenue ?? 0);
    const progress = current
      ? Math.min(
          100,
          Math.round(
            ((revenueNum - Number(current.min)) /
              (Number(current.max) - Number(current.min) || 1)) *
              100,
          ),
        )
      : 0;

    return { current, next, progressToNext: next ? progress : 100, allTiers: tiers };
  }
}
