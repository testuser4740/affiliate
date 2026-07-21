"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmbassadorRepository = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const ambassadors_1 = require("../models/ambassadors");
const typeormLoader_1 = require("../../loaders/typeormLoader");
let AmbassadorRepository = class AmbassadorRepository {
    constructor() {
        this.repository = (0, typeormLoader_1.getConnection)().getRepository(ambassadors_1.Ambassador);
    }
};
exports.AmbassadorRepository = AmbassadorRepository;
exports.AmbassadorRepository = AmbassadorRepository = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__metadata("design:paramtypes", [])
], AmbassadorRepository);
//# sourceMappingURL=AmbassadorRepository.js.map