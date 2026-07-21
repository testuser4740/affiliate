"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderUtilizationRepository = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const order_utilization_logs_1 = require("../models/order-utilization-logs");
const typeormLoader_1 = require("../../loaders/typeormLoader");
let OrderUtilizationRepository = class OrderUtilizationRepository {
    constructor() {
        this.repository = (0, typeormLoader_1.getConnection)().getRepository(order_utilization_logs_1.OrderUtilizationLog);
    }
};
exports.OrderUtilizationRepository = OrderUtilizationRepository;
exports.OrderUtilizationRepository = OrderUtilizationRepository = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__metadata("design:paramtypes", [])
], OrderUtilizationRepository);
//# sourceMappingURL=OrderUtilizationRepository.js.map