"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferralService = void 0;
const typedi_1 = require("typedi");
const data_source_1 = require("../data-source");
const referral_codes_1 = require("../entities/referral-codes");
const order_utilization_logs_1 = require("../entities/order-utilization-logs");
const exceptions_1 = require("../exceptions");
let ReferralService = class ReferralService {
    repo() {
        return data_source_1.AppDataSource.getRepository(referral_codes_1.ReferralCode);
    }
    async list() {
        return this.repo().find();
    }
    async trackUsage(code, orderId, customerId, orderValue) {
        const referral = await this.repo().findOne({ where: { code } });
        if (!referral)
            throw new exceptions_1.ValidationError(`Referral code ${code} not found`);
        if (referral.status !== "Active")
            throw new exceptions_1.ValidationError(`Referral code ${code} is not active`);
        const discount = (Number(referral.value.replace(/[^\d.]/g, "")) || 0) * orderValue / 100;
        const commissionPct = Number(referral.value.replace(/[^\d.]/g, "")) || 0;
        const commissionValue = (commissionPct / 100) * orderValue;
        const log = data_source_1.AppDataSource.getRepository(order_utilization_logs_1.OrderUtilizationLog).create({
            code,
            orderId,
            customerId,
            orderValue,
            usedAt: new Date(),
            discount,
            commissionPct,
            commissionValue,
        });
        const saved = await data_source_1.AppDataSource.getRepository(order_utilization_logs_1.OrderUtilizationLog).save(log);
        referral.uses = (referral.uses ?? 0) + 1;
        referral.gmv = Number(referral.gmv ?? 0) + orderValue;
        referral.commission = Number(referral.commission ?? 0) + commissionValue;
        await this.repo().save(referral);
        return saved;
    }
};
exports.ReferralService = ReferralService;
exports.ReferralService = ReferralService = __decorate([
    (0, typedi_1.Service)()
], ReferralService);
//# sourceMappingURL=referral.service.js.map