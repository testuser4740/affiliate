"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicantController = void 0;
const tslib_1 = require("tslib");
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const applicants_1 = require("../../models/applicants");
const applicant_service_1 = require("../../services/applicant.service");
const applicant_dto_1 = require("../../../dto/applicant.dto");
let ApplicantController = class ApplicantController {
    /**
     * @openapi
     * /admin/applicants:
     *   get:
     *     tags: [Admin / Applicants]
     *     summary: List applicants (filters: q, status, state, city)
     */
    async list(q, status, state, city) {
        const filter = { q, status, state, city };
        return this.service.list(filter);
    }
    async get(id) {
        return this.service.getById(id);
    }
    async create(body) {
        return this.service.create(body);
    }
    async update(id, body) {
        return this.service.update(id, body);
    }
    async remove(id) {
        return this.service.remove(id);
    }
    /**
     * @openapi
     * /admin/applicants/{id}/approve:
     *   post:
     *     tags: [Admin / Applicants]
     *     summary: Approve an applicant (sets 5% default commission)
     */
    async approve(id) {
        return this.service.approve(id);
    }
    async partial(id, body) {
        return this.service.partiallyApprove(id, body);
    }
    async reject(id, body) {
        return this.service.reject(id, body);
    }
};
exports.ApplicantController = ApplicantController;
tslib_1.__decorate([
    (0, typedi_1.Inject)(),
    tslib_1.__metadata("design:type", applicant_service_1.ApplicantService)
], ApplicantController.prototype, "service", void 0);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)("/"),
    (0, routing_controllers_openapi_1.ResponseSchema)(applicants_1.Applicant, { isArray: true }),
    tslib_1.__param(0, (0, routing_controllers_1.QueryParam)("q")),
    tslib_1.__param(1, (0, routing_controllers_1.QueryParam)("status")),
    tslib_1.__param(2, (0, routing_controllers_1.QueryParam)("state")),
    tslib_1.__param(3, (0, routing_controllers_1.QueryParam)("city")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ApplicantController.prototype, "list", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)("/:id"),
    (0, routing_controllers_openapi_1.ResponseSchema)(applicants_1.Applicant),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("id")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ApplicantController.prototype, "get", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Post)("/"),
    (0, routing_controllers_openapi_1.ResponseSchema)(applicants_1.Applicant),
    tslib_1.__param(0, (0, routing_controllers_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [applicant_dto_1.CreateApplicantInput]),
    tslib_1.__metadata("design:returntype", Promise)
], ApplicantController.prototype, "create", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Put)("/:id"),
    (0, routing_controllers_openapi_1.ResponseSchema)(applicants_1.Applicant),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("id")),
    tslib_1.__param(1, (0, routing_controllers_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, applicant_dto_1.UpdateApplicantInput]),
    tslib_1.__metadata("design:returntype", Promise)
], ApplicantController.prototype, "update", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Delete)("/:id"),
    (0, routing_controllers_1.OnUndefined)(204),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("id")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ApplicantController.prototype, "remove", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Post)("/:id/approve"),
    (0, routing_controllers_openapi_1.ResponseSchema)(applicants_1.Applicant),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("id")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ApplicantController.prototype, "approve", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Post)("/:id/partial"),
    (0, routing_controllers_openapi_1.ResponseSchema)(applicants_1.Applicant),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("id")),
    tslib_1.__param(1, (0, routing_controllers_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, applicant_dto_1.ApplicantActionInput]),
    tslib_1.__metadata("design:returntype", Promise)
], ApplicantController.prototype, "partial", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Post)("/:id/reject"),
    (0, routing_controllers_openapi_1.ResponseSchema)(applicants_1.Applicant),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("id")),
    tslib_1.__param(1, (0, routing_controllers_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, applicant_dto_1.ApplicantActionInput]),
    tslib_1.__metadata("design:returntype", Promise)
], ApplicantController.prototype, "reject", null);
exports.ApplicantController = ApplicantController = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/admin/applicants")
], ApplicantController);
//# sourceMappingURL=ApplicantsController.js.map