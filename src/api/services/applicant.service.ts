import { Service } from "typedi";
import { FindOptionsWhere } from "typeorm";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Applicant } from "../models/applicants";
import { Ambassador } from "../models/ambassadors";
import { Tier } from "../models/tiers";
import { User } from "../models/users";
import { AffiliateUrl } from "../models/affiliate-urls";
import { InboxMessage } from "../models/inbox-messages";
import { liveBus } from "../lib/eventBus";
import { ApplicantRepository } from "../repositories/ApplicantRepository";
import { AmbassadorRepository } from "../repositories/AmbassadorRepository";
import { TierRepository } from "../repositories/TierRepository";
import { UserRepository } from "../repositories/UserRepository";
import { AffiliateUrlRepository } from "../repositories/AffiliateUrlRepository";
import { InboxRepository } from "../repositories/InboxRepository";
import { NotFoundError, ValidationError } from "../errors";
import {
  CreateApplicantInput,
  UpdateApplicantInput,
  ApplicantActionInput,
  ConvertApplicantInput,
} from "../../dto/applicant.dto";
import { ApplicantFilter } from "../repositories/ApplicantRepository";
import { hashPassword } from "../lib/auth";

export type ApplicantStatus = "Pending" | "Approved" | "Partially Approved" | "Rejected";

@Service()
export class ApplicantService {
  constructor(
    private applicantRepository: ApplicantRepository,
    private ambassadorRepository: AmbassadorRepository,
    private tierRepository: TierRepository,
    private userRepository: UserRepository,
    private affiliateUrlRepository: AffiliateUrlRepository,
    private inboxMessageRepository: InboxRepository,
    @Logger(__filename) private log: LoggerInterface,
  ) {}

  private repo() {
    return this.applicantRepository.repository;
  }

  async list(filter: ApplicantFilter): Promise<{ data: Applicant[]; total: number }> {
    const data = await this.applicantRepository.search(filter);
    return { data, total: data.length };
  }

  async getById(id: string): Promise<Applicant> {
    const applicant = await this.repo().findOne({ where: { id } });
    if (!applicant) throw new NotFoundError(`Applicant ${id} not found`);
    return applicant;
  }

  async create(input: CreateApplicantInput): Promise<Applicant> {
    const existing = await this.repo().findOne({
      where: [{ email: input.email }, { phone: input.phone }] as FindOptionsWhere<Applicant>[],
    });
    const applicant = this.repo().create({
      ...input,
      duplicate: Boolean(existing),
      status: input.status ?? "Pending",
    } as Partial<Applicant>);
    this.log.info(`Created applicant ${applicant.email}`);
    return this.repo().save(applicant);
  }

  async update(id: string, input: UpdateApplicantInput): Promise<Applicant> {
    const repo = this.repo();
    const applicant = await this.getById(id);
    repo.merge(applicant, input);
    return repo.save(applicant);
  }

  async remove(id: string): Promise<void> {
    const repo = this.repo();
    const applicant = await this.getById(id);
    await repo.remove(applicant);
  }

  async checkDuplicate(email?: string, phone?: string): Promise<{ exists: boolean; duplicate: boolean }> {
    const where: Record<string, unknown>[] = [];
    if (email) where.push({ email });
    if (phone) where.push({ phone });
    const existing = where.length ? await this.repo().findOne({ where }) : null;
    return { exists: Boolean(existing), duplicate: Boolean(existing) };
  }

  async approve(id: string): Promise<Applicant> {
    return this.setStatus(id, "Approved", false);
  }

  async partiallyApprove(id: string, input: ApplicantActionInput): Promise<Applicant> {
    return this.setStatus(id, "Partially Approved", true, input.comment);
  }

  async reject(id: string, input: ApplicantActionInput): Promise<Applicant> {
    return this.setStatus(id, "Rejected", true, input.comment);
  }

  private async setStatus(
    id: string,
    status: ApplicantStatus,
    requireComment: boolean,
    comment?: string,
  ): Promise<Applicant> {
    const repo = this.repo();
    const applicant = await this.getById(id);
    if (requireComment && !comment?.trim()) {
      throw new ValidationError("Comment / reason is required");
    }
    applicant.status = status;
    if (comment) applicant.comments = comment;
    if (status === "Approved" && !applicant.commissionPct) applicant.commissionPct = 5;
    const saved = await repo.save(applicant);
    liveBus.broadcast({ type: "applicants" });
    return saved;
  }

  async convertToAmbassador(id: string, password: string, overrides: Partial<ConvertApplicantInput> = {}): Promise<Ambassador> {
    const applicant = await this.getById(id);
    if (applicant.status !== "Approved") {
      throw new ValidationError("Only approved applicants can be converted");
    }
    const name = overrides.name ?? applicant.name;
    const email = overrides.email ?? applicant.email;
    const phone = overrides.phone ?? applicant.phone;
    const college = overrides.college ?? applicant.college;
    const city = overrides.city ?? applicant.city;
    const state = overrides.state ?? applicant.state;
    const commissionPct = overrides.commissionPct ?? applicant.commissionPct ?? 5;

    const ambRepo = this.ambassadorRepository.repository;
    const userRepo = this.userRepository.repository;
    const existingAmb = await ambRepo.findOne({ where: { email } });
    if (existingAmb) throw new ValidationError("Ambassador already exists for this applicant");
    const existingUser = await userRepo.findOne({ where: { email } });
    if (existingUser) throw new ValidationError("A login user already exists for this email");

    const maxRankResult = await ambRepo
      .createQueryBuilder("a")
      .select("MAX(a.rank)", "maxRank")
      .getRawOne();
    const nextRank = Number(maxRankResult?.maxRank ?? 0) + 1;

    const tierName = (overrides as { tier?: string }).tier ?? "Bronze";
    const tierRecord = await this.tierRepository.repository.findOne({ where: { name: tierName } });

    const ambassador = ambRepo.create({
      id: `amb_${Date.now().toString(36)}`,
      name,
      college,
      city,
      state,
      email,
      phone,
      avatar: `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop`,
      tier: tierRecord ?? undefined,
      commissionPct,
      revenue: 0,
      orders: 0,
      rank: nextRank,
    } as Partial<Ambassador>);
    const savedAmbassador = await ambRepo.save(ambassador);

    // Create the linked login user (role: ambassador) with the provided password.
    const user = userRepo.create({
      email,
      name,
      role: "ambassador",
      ambassadorId: savedAmbassador.id,
      passwordHash: hashPassword(password),
    } as Partial<User>);
    await userRepo.save(user);

    // --- Onboarding propagation: reflect the new ambassador in ALL related tables ---
    // 1) A default affiliate URL (linked by FK).
    const affiliateLink = `https://gajab.com/r/${name.toUpperCase().replace(/[^A-Z]/g, "")}`;
    const urlRepo = this.affiliateUrlRepository.repository;
    await urlRepo.save(
      urlRepo.create({
        id: `URL-${savedAmbassador.id}`,
        ambassadorId: savedAmbassador.id,
        college,
        label: "Master Link",
        url: affiliateLink,
        channel: "All",
        clicks: 0,
        signups: 0,
        orders: 0,
        revenue: 0,
        commission: 0,
      } as Partial<AffiliateUrl>),
    );

    // 2) A welcome inbox message (linked by FK).
    const inboxRepo = this.inboxMessageRepository.repository;
    await inboxRepo.save(
      inboxRepo.create({
        id: `MSG-${savedAmbassador.id}`,
        ambassadorId: savedAmbassador.id,
        from: "Gajab Admin",
        subject: "Welcome to Gajab Ambassadors! 🎉",
        preview: "Your account is live. Share your link and start earning.",
        body: "Welcome aboard! Your ambassador account is now active. Share your magic link, complete tasks, and watch your commissions grow.",
        receivedOn: new Date().toISOString(),
        read: false,
        priority: "Normal",
      } as Partial<InboxMessage>),
    );

    // 3) Remove the source applicant row — they are now an ambassador (single
    //    source of truth lives in the ambassadors table, linked by FK elsewhere).
    await this.applicantRepository.repository.remove(applicant);

    // Notify live clients that a new ambassador joined.
    liveBus.broadcast({ type: "ambassador_created", ambassadorId: savedAmbassador.id });
    liveBus.broadcast({ type: "leaderboard" });
    liveBus.broadcast({ type: "applicants" });

    this.log.info(`Converted applicant ${id} -> ambassador ${savedAmbassador.id} + user ${email}`);
    return savedAmbassador;
  }
}
