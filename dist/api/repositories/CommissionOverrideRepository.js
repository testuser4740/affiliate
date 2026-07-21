"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionOverrideRepository = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const commission_overrides_1 = require("../models/commission-overrides");
const typeormLoader_1 = require("../../loaders/typeormLoader");
let CommissionOverrideRepository = class CommissionOverrideRepository {
    constructor() {
        this.repository = (0, typeormLoader_1.getConnection)().getRepository(commission_overrides_1.CommissionOverride);
    }
};
exports.CommissionOverrideRepository = CommissionOverrideRepository;
exports.CommissionOverrideRepository = CommissionOverrideRepository = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__metadata("design:paramtypes", [])
], CommissionOverrideRepository);
//# sourceMappingURL=CommissionOverrideRepository.js.map