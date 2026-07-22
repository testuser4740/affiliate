import { Service } from "typedi";
import { In } from "typeorm";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Poc } from "../models/pocs";
import { PocRepository } from "../repositories/PocRepository";
import { AmbassadorRepository } from "../repositories/AmbassadorRepository";
import { NotFoundError } from "../errors";
import { CreatePocInput, UpdatePocInput, UpdatePocAmbassadorsInput } from "../../dto/poc.dto";
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
    private ambassadorRepository: AmbassadorRepository,
    @Logger(__filename) private log: LoggerInterface,
  ) {}

  private async withLinked(poc: Poc): Promise<Poc & { linkedAffiliates: string[] }> {
    const loaded = await this.repository.repository.find({
      where: { id: poc.id },
      relations: ["ambassadors"],
    });
    const linked = loaded[0]?.ambassadors ?? [];
    return { ...poc, linkedAffiliates: linked.map((a) => a.name) } as Poc & { linkedAffiliates: string[] };
  }

  async list(filter: PocFilter): Promise<{ data: (Poc & { linkedAffiliates: string[] })[]; total: number }> {
    const repo = this.repository.repository;
    const where: Record<string, unknown> = {};
    if (filter.region) where.region = filter.region;
    if (filter.role) where.role = filter.role;
    const all = await repo.find({ where, order: { name: "ASC" }, relations: ["ambassadors"] });
    const data = all
      .map((p) => ({ ...p, linkedAffiliates: (p.ambassadors ?? []).map((a) => a.name) }) as Poc & { linkedAffiliates: string[] })
      .filter((p) => {
        if (!filter.q) return true;
        return `${p.name}${p.role}${p.region}${p.linkedAffiliates.join("")}`.toLowerCase().includes(filter.q!.toLowerCase());
      });
    return { data, total: data.length };
  }

  async getById(id: string): Promise<Poc & { linkedAffiliates: string[] }> {
    const poc = await this.repository.repository.findOne({ where: { id }, relations: ["ambassadors"] });
    if (!poc) throw new NotFoundError(`POC ${id} not found`);
    return { ...poc, linkedAffiliates: (poc.ambassadors ?? []).map((a) => a.name) } as Poc & { linkedAffiliates: string[] };
  }

  async create(input: CreatePocInput & { linkedAffiliates?: string[] }): Promise<Poc> {
    if (!input.name?.trim() || !input.role?.trim()) throw new NotFoundError("Name and role are required");
    const poc = this.repository.repository.create({
      name: input.name,
      role: input.role,
      region: input.region ?? "",
      email: input.email ?? null,
      phone: input.phone ?? null,
      whatsapp: input.whatsapp ?? null,
      avatar: input.avatar ?? null,
      workingHours: input.workingHours ?? null,
    } as Partial<Poc>);
    const saved = await this.repository.repository.save(poc);

    if (input.linkedAffiliates?.length) {
      await this.updateAmbassadors(saved.id, input.linkedAffiliates);
    }
    liveBus.broadcast({ type: "pocs" });
    return saved;
  }

  async update(id: string, input: UpdatePocInput & { linkedAffiliates?: string[] }): Promise<Poc> {
    const repo = this.repository.repository;
    const poc = await this.getById(id);
    repo.merge(poc, input);
    const saved = await repo.save(poc);

    if (input.linkedAffiliates !== undefined) {
      await this.updateAmbassadors(saved.id, input.linkedAffiliates);
    }
    liveBus.broadcast({ type: "pocs" });
    return saved;
  }

  async updateAmbassadors(pocId: string, names: string[]): Promise<Poc & { linkedAffiliates: string[] }> {
    const ambassadors = await this.ambassadorRepository.repository.find({
      where: { name: In(names) as any },
    });
    const poc = await this.repository.repository.findOne({ where: { id: pocId }, relations: ["ambassadors"] });
    if (!poc) throw new NotFoundError(`POC ${pocId} not found`);
    poc.ambassadors = ambassadors;
    await this.repository.repository.save(poc);

    liveBus.broadcast({ type: "pocs" });
    return this.withLinked({ id: pocId } as Poc);
  }

  async remove(id: string): Promise<void> {
    const repo = this.repository.repository;
    const poc = await this.getById(id);
    await repo.remove(poc);
    liveBus.broadcast({ type: "pocs" });
  }
}
