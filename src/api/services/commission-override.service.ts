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
import { Like } from "typeorm";

const toDateOnly = (d?: Date | string): Date | undefined => {
  if (!d) return undefined;
  const date = d instanceof Date ? d : new Date(d);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const computeStatus = (startDate?: Date, endDate?: Date): string => {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const start = toDateOnly(startDate);
  const end = toDateOnly(endDate);

  if (end && end < todayStart) return "Expired";
  if (start && start.getTime() === todayStart.getTime()) return "Active";
  if (start && start > todayStart) return "Scheduled";
  return "Active";
};

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
    const repo = this.repository.repository;
    const count = await repo.count({ where: { id: Like("CO-%") } });
    const sequence = String(count + 1).padStart(3, "0");
    const today = new Date();
    const override = repo.create({
      id: `CO-${sequence}`,
      label: input.label,
      appliesTo: input.appliesTo,
      overridePct: input.overridePct ?? 0,
      originalPct: input.originalPct ?? 0,
      startDate: input.startDate ? new Date(input.startDate) : new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      endDate: input.endDate ? new Date(input.endDate) : new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
      status: computeStatus(
        input.startDate ? new Date(input.startDate) : undefined,
        input.endDate ? new Date(input.endDate) : undefined,
      ),
    } as Partial<CommissionOverride>);
    const saved = await repo.save(override);
    liveBus.broadcast({ type: "commission_overrides" });
    return saved;
  }

  async update(id: string, input: UpdateCommissionOverrideInput): Promise<CommissionOverride> {
    const repo = this.repository.repository;
    const override = await this.getById(id);
    repo.merge(override, input);
    override.status = computeStatus(override.startDate, override.endDate);
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
