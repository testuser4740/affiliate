"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicantRepository = void 0;
const typeorm_1 = require("typeorm");
const applicants_1 = require("../entities/applicants");
let ApplicantRepository = class ApplicantRepository extends typeorm_1.Repository {
    async search(filter) {
        const where = {};
        if (filter.status && filter.status !== "All")
            where.status = filter.status;
        if (filter.state && filter.state !== "All States")
            where.state = filter.state;
        if (filter.city && filter.city !== "All Cities")
            where.city = filter.city;
        const all = await this.find({ where, order: { appliedOn: "DESC" } });
        if (!filter.q)
            return all;
        const needle = filter.q.toLowerCase();
        return all.filter((a) => `${a.name}${a.college}${a.city}${a.email}${a.state}`.toLowerCase().includes(needle));
    }
    async findByEmailOrPhone(email, phone) {
        return this.findOne({ where: [{ email }, { phone }] });
    }
    async findOrFail(id) {
        const applicant = await this.findOne({ where: { id } });
        if (!applicant) {
            const err = new Error(`Applicant ${id} not found`);
            err.status = 404;
            throw err;
        }
        return applicant;
    }
    async countByPrefix(prefix) {
        return this.count({ where: { id: (0, typeorm_1.Like)(`${prefix}%`) } });
    }
};
exports.ApplicantRepository = ApplicantRepository;
exports.ApplicantRepository = ApplicantRepository = __decorate([
    (0, typeorm_1.EntityRepository)(applicants_1.Applicant)
], ApplicantRepository);
//# sourceMappingURL=applicant.repository.js.map