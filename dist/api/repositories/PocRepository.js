"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PocRepository = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const pocs_1 = require("../models/pocs");
const typeormLoader_1 = require("../../loaders/typeormLoader");
let PocRepository = class PocRepository {
    constructor() {
        this.repository = (0, typeormLoader_1.getConnection)().getRepository(pocs_1.Poc);
    }
};
exports.PocRepository = PocRepository;
exports.PocRepository = PocRepository = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__metadata("design:paramtypes", [])
], PocRepository);
//# sourceMappingURL=PocRepository.js.map