"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferralService = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const Logger_1 = require("../../decorators/Logger");
const ReferralRepository_1 = require("../repositories/ReferralRepository");
const OrderUtilizationRepository_1 = require("../repositories/OrderUtilizationRepository");
const errors_1 = require("../errors");
let ReferralService = class ReferralService {
    constructor(referralRepository, utilizationRepository, log) {
        this.referralRepository = referralRepository;
        this.utilizationRepository = utilizationRepository;
        this.log = log;
    }
    async list() {
        return this.referralRepository.repository.find();
    }
    async trackUsage(code, orderId, customerId, orderValue) {
        const referral = await this.referralRepository.repository.findOne({ where: { code } });
        if (!referral)
            throw new errors_1.ValidationError(`Referral code ${code} not found`);
        if (referral.status !== "Active")
            throw new errors_1.ValidationError(`Referral code ${code} is not active`);
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
        });
        const saved = await this.utilizationRepository.repository.save(log);
        referral.uses = (referral.uses ?? 0) + 1;
        referral.gmv = Number(referral.gmv ?? 0) + orderValue;
        referral.commission = Number(referral.commission ?? 0) + commissionValue;
        await this.referralRepository.repository.save(referral);
        return saved;
    }
};
exports.ReferralService = ReferralService;
exports.ReferralService = ReferralService = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__param(2, (0, Logger_1.Logger)(__filename)),
    tslib_1.__metadata("design:paramtypes", [ReferralRepository_1.ReferralRepository,
        OrderUtilizationRepository_1.OrderUtilizationRepository, Object])
], ReferralService);
//# sourceMappingURL=referral.service.js.map