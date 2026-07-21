"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TierRepository = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const tiers_1 = require("../models/tiers");
const typeormLoader_1 = require("../../loaders/typeormLoader");
let TierRepository = class TierRepository {
    constructor() {
        this.repository = (0, typeormLoader_1.getConnection)().getRepository(tiers_1.Tier);
    }
};
exports.TierRepository = TierRepository;
exports.TierRepository = TierRepository = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__metadata("design:paramtypes", [])
], TierRepository);
//# sourceMappingURL=TierRepository.js.map