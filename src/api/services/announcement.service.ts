import { Service } from "typedi";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Announcement } from "../models/announcements";
import { AnnouncementRepository } from "../repositories/AnnouncementRepository";
import { AnnouncementReadReceipt } from "../models/announcement-read-receipts";
import { AnnouncementReadReceiptRepository } from "../repositories/AnnouncementReadReceiptRepository";
import { NotFoundError } from "../errors";
import {
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
} from "../../dto/announcement.dto";
import { AmbassadorService } from "./ambassador.service";
import { liveBus } from "../lib/eventBus";

@Service()
export class AnnouncementService {
  constructor(
    private repository: AnnouncementRepository,
    private readReceiptRepository: AnnouncementReadReceiptRepository,
    private ambassadorService: AmbassadorService,
    @Logger(__filename) private log: LoggerInterface,
  ) {}

  async list(audience?: string, priority?: string, tier?: string, city?: string, state?: string): Promise<{ data: Announcement[]; total: number }> {
    const data = await this.repository.search({ audience, priority, tier, city, state });
    return { data, total: data.length };
  }

  async getById(id: string): Promise<Announcement> {
    const item = await this.repository.findOrFail(id);
    return item;
  }

  async create(input: CreateAnnouncementInput): Promise<Announcement> {
    if (!input.title?.trim()) throw new NotFoundError("Title is required");
    const item = this.repository.repository.create({
      title: input.title,
      body: input.body ?? "",
      audience: input.audience ?? "All Ambassadors",
      tier: input.tier || null,
      city: input.city || null,
      state: input.state || null,
      priority: input.priority ?? "Medium",
      sendToAmbassadors: true,
      sentOn: new Date(),
    } as Partial<Announcement>);
    this.log.info(`Announcement created: ${item.title}`);
    try {
      const saved = await this.repository.repository.save(item);
      try { liveBus.broadcast({ type: "announcements" }); } catch (e) { /* broadcast must not fail the request */ }
      return saved;
    } catch (err) {
      this.log.error("Announcement save failed", err);
      throw err;
    }
  }

  async update(id: string, input: UpdateAnnouncementInput): Promise<Announcement> {
    const repo = this.repository.repository;
    const item = await this.getById(id);
    repo.merge(item, input);
    const saved = await repo.save(item);
    liveBus.broadcast({ type: "announcements" });
    return saved;
  }

  async remove(id: string): Promise<void> {
    const repo = this.repository.repository;
    const item = await this.getById(id);
    await repo.remove(item);
    liveBus.broadcast({ type: "announcements" });
  }

  async forAudience(audience?: string): Promise<Announcement[]> {
    return this.repository.search({ audience });
  }

  async getForAmbassador(ambassadorId: string): Promise<Announcement[]> {
    const ambassador = await this.ambassadorService.getById(ambassadorId);
    const tierName = ambassador.tier?.name;

    const repo = this.repository.repository;
    const qb = repo.createQueryBuilder("announcement");

    const tierAudience =
      tierName === "Gold" || tierName === "Platinum"
        ? "Gold + Platinum tiers"
        : tierName === "Silver"
        ? "Silver tier"
        : tierName === "Bronze"
        ? "Bronze tier"
        : undefined;

    const whereClauses = ["announcement.audience = :allAudience"];
    const params: Record<string, unknown> = { allAudience: "All Ambassadors" };

    if (tierAudience) {
      whereClauses.push("announcement.audience = :tierAudience");
      params.tierAudience = tierAudience;
    }

    if (ambassador.city) {
      whereClauses.push(
        "(announcement.audience = 'Specific city' AND announcement.city = :city)"
      );
      params.city = ambassador.city;
    }

    if (ambassador.state) {
      whereClauses.push(
        "(announcement.audience = 'Specific state' AND announcement.state = :state)"
      );
      params.state = ambassador.state;
    }

    qb.where(`(${whereClauses.join(" OR ")})`, params);
    qb.orderBy("announcement.sentOn", "DESC");
    return qb.getMany();
  }

  async markAsRead(announcementId: string, ambassadorId: string): Promise<AnnouncementReadReceipt> {
    const receipt = await this.readReceiptRepository.markRead(announcementId, ambassadorId);
    return receipt;
  }

  async getReadStatus(announcementId: string, ambassadorId: string): Promise<{ isRead: boolean }> {
    const receipt = await this.readReceiptRepository.findReceipt(announcementId, ambassadorId);
    return { isRead: !!receipt?.readAt };
  }

  async getReadCount(announcementId: string): Promise<number> {
    return this.readReceiptRepository.getReadCount(announcementId);
  }

  async getUnreadForAmbassador(ambassadorId: string): Promise<AnnouncementReadReceipt[]> {
    return this.readReceiptRepository.getUnreadForAmbassador(ambassadorId);
  }
}
