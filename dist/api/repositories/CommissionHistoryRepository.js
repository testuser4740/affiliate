"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionHistoryRepository = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const commission_history_1 = require("../models/commission-history");
const typeormLoader_1 = require("../../loaders/typeormLoader");
let CommissionHistoryRepository = class CommissionHistoryRepository {
    constructor() {
        this.repository = (0, typeormLoader_1.getConnection)().getRepository(commission_history_1.CommissionHistory);
    }
};
exports.CommissionHistoryRepository = CommissionHistoryRepository;
exports.CommissionHistoryRepository = CommissionHistoryRepository = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__metadata("design:paramtypes", [])
], CommissionHistoryRepository);
//# sourceMappingURL=CommissionHistoryRepository.js.map