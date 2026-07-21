"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferralRepository = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const referral_codes_1 = require("../models/referral-codes");
const typeormLoader_1 = require("../../loaders/typeormLoader");
let ReferralRepository = class ReferralRepository {
    constructor() {
        this.repository = (0, typeormLoader_1.getConnection)().getRepository(referral_codes_1.ReferralCode);
    }
};
exports.ReferralRepository = ReferralRepository;
exports.ReferralRepository = ReferralRepository = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__metadata("design:paramtypes", [])
], ReferralRepository);
//# sourceMappingURL=ReferralRepository.js.map