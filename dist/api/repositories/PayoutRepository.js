"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutRepository = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const payouts_1 = require("../models/payouts");
const typeormLoader_1 = require("../../loaders/typeormLoader");
let PayoutRepository = class PayoutRepository {
    constructor() {
        this.repository = (0, typeormLoader_1.getConnection)().getRepository(payouts_1.Payout);
    }
};
exports.PayoutRepository = PayoutRepository;
exports.PayoutRepository = PayoutRepository = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__metadata("design:paramtypes", [])
], PayoutRepository);
//# sourceMappingURL=PayoutRepository.js.map