"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AffiliateUrlService = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const Logger_1 = require("../../decorators/Logger");
const AffiliateUrlRepository_1 = require("../repositories/AffiliateUrlRepository");
const errors_1 = require("../errors");
let AffiliateUrlService = class AffiliateUrlService {
    constructor(repository, log) {
        this.repository = repository;
        this.log = log;
    }
    async list(filter) {
        const repo = this.repository.repository;
        const where = {};
        if (filter.ambassador)
            where.ambassador = filter.ambassador;
        if (filter.channel && filter.channel !== "All")
            where.channel = filter.channel;
        const all = await repo.find({ where, order: { lastClick: "DESC" } });
        const data = filter.q
            ? all.filter((u) => `${u.label}${u.ambassador}${u.college}${u.url}`.toLowerCase().includes(filter.q.toLowerCase()))
            : all;
        return { data, total: data.length };
    }
    async getById(id) {
        const url = await this.repository.repository.findOne({ where: { id } });
        if (!url)
            throw new errors_1.NotFoundError(`Affiliate URL ${id} not found`);
        return url;
    }
    async create(input) {
        if (!input.url?.trim())
            throw new errors_1.NotFoundError("URL is required");
        const url = this.repository.repository.create(input);
        return this.repository.repository.save(url);
    }
    async update(id, input) {
        const repo = this.repository.repository;
        const url = await this.getById(id);
        repo.merge(url, input);
        return repo.save(url);
    }
    async remove(id) {
        const repo = this.repository.repository;
        const url = await this.getById(id);
        await repo.remove(url);
    }
};
exports.AffiliateUrlService = AffiliateUrlService;
exports.AffiliateUrlService = AffiliateUrlService = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__param(1, (0, Logger_1.Logger)(__filename)),
    tslib_1.__metadata("design:paramtypes", [AffiliateUrlRepository_1.AffiliateUrlRepository, Object])
], AffiliateUrlService);
//# sourceMappingURL=affiliate-url.service.js.map