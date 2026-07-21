"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicantRepository = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const typedi_1 = require("typedi");
const applicants_1 = require("../models/applicants");
const typeormLoader_1 = require("../../loaders/typeormLoader");
let ApplicantRepository = class ApplicantRepository {
    constructor() {
        this.repository = (0, typeormLoader_1.getConnection)().getRepository(applicants_1.Applicant);
    }
    async search(filter) {
        const where = {};
        if (filter.status && filter.status !== 'All')
            where.status = filter.status;
        if (filter.state && filter.state !== 'All States')
            where.state = filter.state;
        if (filter.city && filter.city !== 'All Cities')
            where.city = filter.city;
        const all = await this.repository.find({ where, order: { appliedOn: 'DESC' } });
        if (!filter.q)
            return all;
        const needle = filter.q.toLowerCase();
        return all.filter((a) => `${a.name}${a.college}${a.city}${a.email}${a.state}`.toLowerCase().includes(needle));
    }
    async findByEmailOrPhone(email, phone) {
        return this.repository.findOne({ where: [{ email }, { phone }] });
    }
    async findOrFail(id) {
        const applicant = await this.repository.findOne({ where: { id } });
        if (!applicant) {
            const err = new Error(`Applicant ${id} not found`);
            err.status = 404;
            throw err;
        }
        return applicant;
    }
    async countByPrefix(prefix) {
        return this.repository.count({ where: { id: (0, typeorm_1.Like)(`${prefix}%`) } });
    }
};
exports.ApplicantRepository = ApplicantRepository;
exports.ApplicantRepository = ApplicantRepository = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__metadata("design:paramtypes", [])
], ApplicantRepository);
//# sourceMappingURL=ApplicantRepository.js.map