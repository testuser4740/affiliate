import { Service } from "typedi";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { AffiliateUrl } from "../models/affiliate-urls";
import { Ambassador } from "../models/ambassadors";
import { AffiliateUrlRepository } from "../repositories/AffiliateUrlRepository";
import { AmbassadorRepository } from "../repositories/AmbassadorRepository";
import { NotFoundError } from "../errors";
import {
  CreateAffiliateUrlInput,
  UpdateAffiliateUrlInput,
} from "../../dto/affiliate-url.dto";
import { liveBus } from "../lib/eventBus";

export interface AffiliateUrlFilter {
  ambassadorId?: string;
  channel?: string;
  q?: string;
}

@Service()
export class AffiliateUrlService {
  constructor(
    private repository: AffiliateUrlRepository,
    private ambassadorRepository: AmbassadorRepository,
    @Logger(__filename) private log: LoggerInterface,
  ) {}

  async list(filter: AffiliateUrlFilter): Promise<{ data: AffiliateUrl[]; total: number }> {
    const repo = this.repository.repository;
    const where: Record<string, unknown> = {};
    if (filter.ambassadorId) where.ambassadorId = filter.ambassadorId;
    if (filter.channel && filter.channel !== "All") where.channel = filter.channel;
    const all = await repo.find({ where, order: { lastClick: "DESC" }, relations: ["ambassador"] });
    const data = filter.q
      ? all.filter((u) =>
          `${u.label}${u.college}${u.url}${u.ambassador?.name ?? ""}`.toLowerCase().includes(filter.q!.toLowerCase()),
        )
      : all;
    return { data, total: data.length };
  }

  async getById(id: string): Promise<AffiliateUrl> {
    const url = await this.repository.repository.findOne({ where: { id }, relations: ["ambassador"] });
    if (!url) throw new NotFoundError(`Affiliate URL ${id} not found`);
    return url;
  }

  async create(input: CreateAffiliateUrlInput): Promise<AffiliateUrl> {
    if (!input.url?.trim()) throw new NotFoundError("URL is required");
    const ambassador = input.ambassador
      ? await this.ambassadorRepository.repository.findOne({ where: { id: input.ambassador } })
      : null;
    const url = this.repository.repository.create({
      ...input,
      ambassador,
    } as Partial<AffiliateUrl>);
    const saved = await this.repository.repository.save(url);
    liveBus.broadcast({ type: "affiliate_urls" });
    liveBus.broadcast({ type: "leaderboard" });
    return saved;
  }

  async update(id: string, input: UpdateAffiliateUrlInput): Promise<AffiliateUrl> {
    const repo = this.repository.repository;
    const url = await this.getById(id);
    const { ambassador: ambassadorId, ...rest } = input;
    if (ambassadorId) {
      const amb = await this.ambassadorRepository.repository.findOne({ where: { id: ambassadorId } });
      if (amb) url.ambassador = amb;
    }
    repo.merge(url, rest);
    const saved = await repo.save(url);
    liveBus.broadcast({ type: "affiliate_urls" });
    liveBus.broadcast({ type: "leaderboard" });
    return saved;
  }

  async remove(id: string): Promise<void> {
    const repo = this.repository.repository;
    const url = await this.getById(id);
    await repo.remove(url);
    liveBus.broadcast({ type: "affiliate_urls" });
    liveBus.broadcast({ type: "leaderboard" });
  }
}
