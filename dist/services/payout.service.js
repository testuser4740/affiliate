"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutService = void 0;
const typedi_1 = require("typedi");
const data_source_1 = require("../data-source");
const payouts_1 = require("../entities/payouts");
let PayoutService = class PayoutService {
    async list(ambassadorId, month) {
        void ambassadorId;
        const where = {};
        if (month)
            where.month = month;
        return data_source_1.AppDataSource.getRepository(payouts_1.Payout).find({ where, order: { period: "DESC" } });
    }
};
exports.PayoutService = PayoutService;
exports.PayoutService = PayoutService = __decorate([
    (0, typedi_1.Service)()
], PayoutService);
//# sourceMappingURL=payout.service.js.map