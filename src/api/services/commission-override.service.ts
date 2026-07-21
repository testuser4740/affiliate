import { Service } from "typedi";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { CommissionOverride } from "../models/commission-overrides";
import { CommissionOverrideRepository } from "../repositories/CommissionOverrideRepository";
import { NotFoundError } from "../errors";
import {
  CreateCommissionOverrideInput,
  UpdateCommissionOverrideInput,
} from "../../dto/commission-override.dto";
import { liveBus } from "../lib/eventBus";

export interface CommissionOverrideFilter {
  status?: string;
  q?: string;
}

@Service()
export class CommissionOverrideService {
  constructor(
    private repository: CommissionOverrideRepository,
    @Logger(__filename) private log: LoggerInterface,
  ) {}

  async list(filter: CommissionOverrideFilter): Promise<{ data: CommissionOverride[]; total: number }> {
    const repo = this.repository.repository;
    const where: Record<string, unknown> = {};
    if (filter.status && filter.status !== "All statuses") where.status = filter.status;
    const all = await repo.find({ where, order: { startDate: "DESC" } });
    const data = filter.q
      ? all.filter((o) => `${o.id}${o.label}${o.appliesTo}`.toLowerCase().includes(filter.q!.toLowerCase()))
      : all;
    return { data, total: data.length };
  }

  async getById(id: string): Promise<CommissionOverride> {
    const override = await this.repository.repository.findOne({ where: { id } });
    if (!override) throw new NotFoundError(`Override ${id} not found`);
    return override;
  }

  async create(input: CreateCommissionOverrideInput): Promise<CommissionOverride> {
    if (!input.label?.trim()) throw new NotFoundError("Campaign label is required");
    const override = this.repository.repository.create({
      label: input.label,
      appliesTo: input.appliesTo,
      overridePct: input.overridePct ?? 0,
      originalPct: input.originalPct ?? 0,
      startDate: input.startDate ? new Date(input.startDate) : undefined,
      endDate: input.endDate ? new Date(input.endDate) : undefined,
      status: input.status ?? "Scheduled",
    } as Partial<CommissionOverride>);
    const saved = await this.repository.repository.save(override);
    liveBus.broadcast({ type: "commission_overrides" });
    return saved;
  }

  async update(id: string, input: UpdateCommissionOverrideInput): Promise<CommissionOverride> {
    const repo = this.repository.repository;
    const override = await this.getById(id);
    repo.merge(override, input);
    const saved = await repo.save(override);
    liveBus.broadcast({ type: "commission_overrides" });
    return saved;
  }

  async remove(id: string): Promise<void> {
    const repo = this.repository.repository;
    const override = await this.getById(id);
    await repo.remove(override);
    liveBus.broadcast({ type: "commission_overrides" });
  }
}
