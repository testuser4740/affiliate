"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AffiliateUrlService = void 0;
const typedi_1 = require("typedi");
const data_source_1 = require("../data-source");
const affiliate_urls_1 = require("../entities/affiliate-urls");
const exceptions_1 = require("../exceptions");
let AffiliateUrlService = class AffiliateUrlService {
    repo() {
        return data_source_1.AppDataSource.getRepository(affiliate_urls_1.AffiliateUrl);
    }
    async list(filter) {
        const where = {};
        if (filter.ambassador)
            where.ambassador = filter.ambassador;
        if (filter.channel && filter.channel !== "All")
            where.channel = filter.channel;
        const all = await this.repo().find({ where, order: { lastClick: "DESC" } });
        const data = filter.q
            ? all.filter((u) => `${u.label}${u.ambassador}${u.college}${u.url}`.toLowerCase().includes(filter.q.toLowerCase()))
            : all;
        return { data, total: data.length };
    }
    async getById(id) {
        const url = await this.repo().findOne({ where: { id } });
        if (!url)
            throw new exceptions_1.NotFoundError(`Affiliate URL ${id} not found`);
        return url;
    }
    async create(input) {
        if (!input.url?.trim())
            throw new exceptions_1.NotFoundError("URL is required");
        const url = this.repo().create(input);
        return this.repo().save(url);
    }
    async update(id, input) {
        const repo = this.repo();
        const url = await this.getById(id);
        repo.merge(url, input);
        return repo.save(url);
    }
    async remove(id) {
        const repo = this.repo();
        const url = await this.getById(id);
        await repo.remove(url);
    }
};
exports.AffiliateUrlService = AffiliateUrlService;
exports.AffiliateUrlService = AffiliateUrlService = __decorate([
    (0, typedi_1.Service)()
], AffiliateUrlService);
//# sourceMappingURL=affiliate-url.service.js.map