"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TierService = void 0;
const typedi_1 = require("typedi");
const data_source_1 = require("../data-source");
const tiers_1 = require("../entities/tiers");
let TierService = class TierService {
    repo() {
        return data_source_1.AppDataSource.getRepository(tiers_1.Tier);
    }
    async list() {
        return this.repo().find({ order: { min: "ASC" } });
    }
    async getByName(name) {
        return this.repo().findOne({ where: { name } });
    }
    resolveProgression(revenue, tiers) {
        const matched = tiers.find((t) => Number(t.min) <= revenue && revenue <= Number(t.max));
        const current = matched ?? tiers[0];
        const next = tiers.find((t) => Number(t.min) > revenue) ?? null;
        const revenueNum = Number(revenue ?? 0);
        const progress = current
            ? Math.min(100, Math.round(((revenueNum - Number(current.min)) /
                (Number(current.max) - Number(current.min) || 1)) *
                100))
            : 0;
        return { current, next, progressToNext: next ? progress : 100, allTiers: tiers };
    }
};
exports.TierService = TierService;
exports.TierService = TierService = __decorate([
    (0, typedi_1.Service)()
], TierService);
//# sourceMappingURL=tier.service.js.map