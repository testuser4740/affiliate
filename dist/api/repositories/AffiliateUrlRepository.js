"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AffiliateUrlRepository = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const affiliate_urls_1 = require("../models/affiliate-urls");
const typeormLoader_1 = require("../../loaders/typeormLoader");
let AffiliateUrlRepository = class AffiliateUrlRepository {
    constructor() {
        this.repository = (0, typeormLoader_1.getConnection)().getRepository(affiliate_urls_1.AffiliateUrl);
    }
};
exports.AffiliateUrlRepository = AffiliateUrlRepository;
exports.AffiliateUrlRepository = AffiliateUrlRepository = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__metadata("design:paramtypes", [])
], AffiliateUrlRepository);
//# sourceMappingURL=AffiliateUrlRepository.js.map