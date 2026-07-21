"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicantService = void 0;
const typedi_1 = require("typedi");
const applicants_1 = require("../entities/applicants");
const ambassadors_1 = require("../entities/ambassadors");
const data_source_1 = require("../data-source");
const exceptions_1 = require("../exceptions");
let ApplicantService = class ApplicantService {
    repo() {
        return data_source_1.AppDataSource.getRepository(applicants_1.Applicant);
    }
    async list(filter) {
        const where = {};
        if (filter.status && filter.status !== "All")
            where.status = filter.status;
        if (filter.state && filter.state !== "All States")
            where.state = filter.state;
        if (filter.city && filter.city !== "All Cities")
            where.city = filter.city;
        const all = await this.repo().find({ where, order: { appliedOn: "DESC" } });
        const data = filter.q
            ? all.filter((a) => `${a.name}${a.college}${a.city}${a.email}${a.state}`.toLowerCase().includes(filter.q.toLowerCase()))
            : all;
        return { data, total: data.length };
    }
    async getById(id) {
        const applicant = await this.repo().findOne({ where: { id } });
        if (!applicant)
            throw new exceptions_1.NotFoundError(`Applicant ${id} not found`);
        return applicant;
    }
    async create(input) {
        const repo = this.repo();
        const existing = await repo.findOne({
            where: [{ email: input.email }, { phone: input.phone }],
        });
        const applicant = repo.create({
            ...input,
            duplicate: Boolean(existing),
            status: input.status ?? "Pending",
        });
        return repo.save(applicant);
    }
    async update(id, input) {
        const repo = this.repo();
        const applicant = await this.getById(id);
        repo.merge(applicant, input);
        return repo.save(applicant);
    }
    async remove(id) {
        const repo = this.repo();
        const applicant = await this.getById(id);
        await repo.remove(applicant);
    }
    async checkDuplicate(email, phone) {
        const where = [];
        if (email)
            where.push({ email });
        if (phone)
            where.push({ phone });
        const existing = where.length ? await this.repo().findOne({ where }) : null;
        return { exists: Boolean(existing), duplicate: Boolean(existing) };
    }
    async approve(id) {
        return this.setStatus(id, "Approved", false);
    }
    async partiallyApprove(id, input) {
        return this.setStatus(id, "Partially Approved", true, input.comment);
    }
    async reject(id, input) {
        return this.setStatus(id, "Rejected", true, input.comment);
    }
    async setStatus(id, status, requireComment, comment) {
        const repo = this.repo();
        const applicant = await this.getById(id);
        if (requireComment && !comment?.trim()) {
            throw new exceptions_1.ValidationError("Comment / reason is required");
        }
        applicant.status = status;
        if (comment)
            applicant.comments = comment;
        if (status === "Approved" && !applicant.commissionPct)
            applicant.commissionPct = 5;
        return repo.save(applicant);
    }
    async convertToAmbassador(id) {
        const applicant = await this.getById(id);
        if (applicant.status !== "Approved") {
            throw new exceptions_1.ValidationError("Only approved applicants can be converted");
        }
        const ambRepo = data_source_1.AppDataSource.getRepository(ambassadors_1.Ambassador);
        const existing = await ambRepo.findOne({ where: { email: applicant.email } });
        if (existing)
            throw new exceptions_1.ValidationError("Ambassador already exists for this applicant");
        const ambassador = ambRepo.create({
            name: applicant.name,
            college: applicant.college,
            city: applicant.city,
            state: applicant.state,
            email: applicant.email,
            phone: applicant.phone,
            affiliateLink: `https://gajab.com/r/${applicant.name.toUpperCase().replace(/[^A-Z]/g, "")}`,
            tier: "Bronze",
            commissionPct: applicant.commissionPct || 5,
            revenue: 0,
            orders: 0,
        });
        return ambRepo.save(ambassador);
    }
};
exports.ApplicantService = ApplicantService;
exports.ApplicantService = ApplicantService = __decorate([
    (0, typedi_1.Service)()
], ApplicantService);
//# sourceMappingURL=applicant.service.js.map