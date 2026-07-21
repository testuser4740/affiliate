"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicantController = void 0;
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const applicants_1 = require("../../entities/applicants");
const applicant_service_1 = require("../../services/applicant.service");
const applicant_dto_1 = require("../../dto/applicant.dto");
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
__decorate([
    (0, typedi_1.Inject)(),
    __metadata("design:type", applicant_service_1.ApplicantService)
], ApplicantController.prototype, "service", void 0);
__decorate([
    (0, routing_controllers_1.Get)("/"),
    (0, routing_controllers_openapi_1.ResponseSchema)(applicants_1.Applicant, { isArray: true }),
    __param(0, (0, routing_controllers_1.QueryParam)("q")),
    __param(1, (0, routing_controllers_1.QueryParam)("status")),
    __param(2, (0, routing_controllers_1.QueryParam)("state")),
    __param(3, (0, routing_controllers_1.QueryParam)("city")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ApplicantController.prototype, "list", null);
__decorate([
    (0, routing_controllers_1.Get)("/:id"),
    (0, routing_controllers_openapi_1.ResponseSchema)(applicants_1.Applicant),
    __param(0, (0, routing_controllers_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApplicantController.prototype, "get", null);
__decorate([
    (0, routing_controllers_1.Post)("/"),
    (0, routing_controllers_openapi_1.ResponseSchema)(applicants_1.Applicant),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [applicant_dto_1.CreateApplicantInput]),
    __metadata("design:returntype", Promise)
], ApplicantController.prototype, "create", null);
__decorate([
    (0, routing_controllers_1.Put)("/:id"),
    (0, routing_controllers_openapi_1.ResponseSchema)(applicants_1.Applicant),
    __param(0, (0, routing_controllers_1.Param)("id")),
    __param(1, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, applicant_dto_1.UpdateApplicantInput]),
    __metadata("design:returntype", Promise)
], ApplicantController.prototype, "update", null);
__decorate([
    (0, routing_controllers_1.Delete)("/:id"),
    (0, routing_controllers_1.OnUndefined)(204),
    __param(0, (0, routing_controllers_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApplicantController.prototype, "remove", null);
__decorate([
    (0, routing_controllers_1.Post)("/:id/approve"),
    (0, routing_controllers_openapi_1.ResponseSchema)(applicants_1.Applicant),
    __param(0, (0, routing_controllers_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApplicantController.prototype, "approve", null);
__decorate([
    (0, routing_controllers_1.Post)("/:id/partial"),
    (0, routing_controllers_openapi_1.ResponseSchema)(applicants_1.Applicant),
    __param(0, (0, routing_controllers_1.Param)("id")),
    __param(1, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, applicant_dto_1.ApplicantActionInput]),
    __metadata("design:returntype", Promise)
], ApplicantController.prototype, "partial", null);
__decorate([
    (0, routing_controllers_1.Post)("/:id/reject"),
    (0, routing_controllers_openapi_1.ResponseSchema)(applicants_1.Applicant),
    __param(0, (0, routing_controllers_1.Param)("id")),
    __param(1, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, applicant_dto_1.ApplicantActionInput]),
    __metadata("design:returntype", Promise)
], ApplicantController.prototype, "reject", null);
exports.ApplicantController = ApplicantController = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/admin/applicants")
], ApplicantController);
//# sourceMappingURL=applicants.js.map