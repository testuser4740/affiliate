import { Service } from "typedi";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Poc } from "../models/pocs";
import { PocRepository } from "../repositories/PocRepository";
import { NotFoundError } from "../errors";
import { CreatePocInput, UpdatePocInput } from "../../dto/poc.dto";
import { liveBus } from "../lib/eventBus";

export interface PocFilter {
  region?: string;
  role?: string;
  q?: string;
}

@Service()
export class PocService {
  constructor(
    private repository: PocRepository,
    @Logger(__filename) private log: LoggerInterface,
  ) {}

  async list(filter: PocFilter): Promise<{ data: Poc[]; total: number }> {
    const repo = this.repository.repository;
    const where: Record<string, unknown> = {};
    if (filter.region) where.region = filter.region;
    if (filter.role) where.role = filter.role;
    const all = await repo.find({ where, order: { name: "ASC" } });
    const data = filter.q
      ? all.filter((p) => `${p.name}${p.role}${p.region}`.toLowerCase().includes(filter.q!.toLowerCase()))
      : all;
    return { data, total: data.length };
  }

  async getById(id: string): Promise<Poc> {
    const poc = await this.repository.repository.findOne({ where: { id } });
    if (!poc) throw new NotFoundError(`POC ${id} not found`);
    return poc;
  }

  async create(input: CreatePocInput): Promise<Poc> {
    if (!input.name?.trim() || !input.role?.trim()) throw new NotFoundError("Name and role are required");
    const poc = this.repository.repository.create(input as Partial<Poc>);
    const saved = await this.repository.repository.save(poc);
    liveBus.broadcast({ type: "pocs" });
    return saved;
  }

  async update(id: string, input: UpdatePocInput): Promise<Poc> {
    const repo = this.repository.repository;
    const poc = await this.getById(id);
    repo.merge(poc, input);
    const saved = await repo.save(poc);
    liveBus.broadcast({ type: "pocs" });
    return saved;
  }

  async remove(id: string): Promise<void> {
    const repo = this.repository.repository;
    const poc = await this.getById(id);
    await repo.remove(poc);
    liveBus.broadcast({ type: "pocs" });
  }
}
