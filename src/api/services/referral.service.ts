import { Service } from "typedi";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { ReferralCode } from "../models/referral-codes";
import { OrderUtilizationLog } from "../models/order-utilization-logs";
import { ReferralRepository } from "../repositories/ReferralRepository";
import { OrderUtilizationRepository } from "../repositories/OrderUtilizationRepository";
import { ValidationError } from "../errors";

@Service()
export class ReferralService {
  constructor(
    private referralRepository: ReferralRepository,
    private utilizationRepository: OrderUtilizationRepository,
    @Logger(__filename) private log: LoggerInterface,
  ) {}

  async list(): Promise<ReferralCode[]> {
    return this.referralRepository.repository.find();
  }

  async trackUsage(code: string, orderId: string, customerId: string, orderValue: number): Promise<OrderUtilizationLog> {
    const referral = await this.referralRepository.repository.findOne({ where: { code } });
    if (!referral) throw new ValidationError(`Referral code ${code} not found`);
    if (referral.status !== "Active") throw new ValidationError(`Referral code ${code} is not active`);

    const discount = (Number(referral.value.replace(/[^\d.]/g, "")) || 0) * orderValue / 100;
    const commissionPct = Number(referral.value.replace(/[^\d.]/g, "")) || 0;
    const commissionValue = (commissionPct / 100) * orderValue;

    const log = this.utilizationRepository.repository.create({
      code,
      orderId,
      customerId,
      orderValue,
      usedAt: new Date(),
      discount,
      commissionPct,
      commissionValue,
    } as Partial<OrderUtilizationLog>);
    const saved = await this.utilizationRepository.repository.save(log);

    referral.uses = (referral.uses ?? 0) + 1;
    referral.gmv = Number(referral.gmv ?? 0) + orderValue;
    referral.commission = Number(referral.commission ?? 0) + commissionValue;
    await this.referralRepository.repository.save(referral);

    return saved;
  }
}
