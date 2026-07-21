"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicantService = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const Logger_1 = require("../../decorators/Logger");
const ApplicantRepository_1 = require("../repositories/ApplicantRepository");
const AmbassadorRepository_1 = require("../repositories/AmbassadorRepository");
const errors_1 = require("../errors");
let ApplicantService = class ApplicantService {
    constructor(applicantRepository, ambassadorRepository, log) {
        this.applicantRepository = applicantRepository;
        this.ambassadorRepository = ambassadorRepository;
        this.log = log;
    }
    repo() {
        return this.applicantRepository.repository;
    }
    async list(filter) {
        const data = await this.applicantRepository.search(filter);
        return { data, total: data.length };
    }
    async getById(id) {
        const applicant = await this.repo().findOne({ where: { id } });
        if (!applicant)
            throw new errors_1.NotFoundError(`Applicant ${id} not found`);
        return applicant;
    }
    async create(input) {
        const existing = await this.repo().findOne({
            where: [{ email: input.email }, { phone: input.phone }],
        });
        const applicant = this.repo().create({
            ...input,
            duplicate: Boolean(existing),
            status: input.status ?? "Pending",
        });
        this.log.info(`Created applicant ${applicant.email}`);
        return this.repo().save(applicant);
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
            throw new errors_1.ValidationError("Comment / reason is required");
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
            throw new errors_1.ValidationError("Only approved applicants can be converted");
        }
        const ambRepo = this.ambassadorRepository.repository;
        const existing = await ambRepo.findOne({ where: { email: applicant.email } });
        if (existing)
            throw new errors_1.ValidationError("Ambassador already exists for this applicant");
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
exports.ApplicantService = ApplicantService = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__param(2, (0, Logger_1.Logger)(__filename)),
    tslib_1.__metadata("design:paramtypes", [ApplicantRepository_1.ApplicantRepository,
        AmbassadorRepository_1.AmbassadorRepository, Object])
], ApplicantService);
//# sourceMappingURL=applicant.service.js.map