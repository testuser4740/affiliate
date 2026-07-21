import { Service } from "typedi";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Payout } from "../models/payouts";
import { PayoutRepository } from "../repositories/PayoutRepository";

@Service()
export class PayoutService {
  constructor(
    private repository: PayoutRepository,
    @Logger(__filename) private log: LoggerInterface,
  ) {}

  async list(ambassadorId: string, month?: string): Promise<Payout[]> {
    void ambassadorId;
    const where: Record<string, unknown> = {};
    if (month) where.month = month;
    return this.repository.repository.find({ where, order: { period: "DESC" } });
  }
}
