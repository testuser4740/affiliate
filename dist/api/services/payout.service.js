"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutService = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const Logger_1 = require("../../decorators/Logger");
const PayoutRepository_1 = require("../repositories/PayoutRepository");
let PayoutService = class PayoutService {
    constructor(repository, log) {
        this.repository = repository;
        this.log = log;
    }
    async list(ambassadorId, month) {
        void ambassadorId;
        const where = {};
        if (month)
            where.month = month;
        return this.repository.repository.find({ where, order: { period: "DESC" } });
    }
};
exports.PayoutService = PayoutService;
exports.PayoutService = PayoutService = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__param(1, (0, Logger_1.Logger)(__filename)),
    tslib_1.__metadata("design:paramtypes", [PayoutRepository_1.PayoutRepository, Object])
], PayoutService);
//# sourceMappingURL=payout.service.js.map