"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplyController = void 0;
const tslib_1 = require("tslib");
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const applicants_1 = require("../models/applicants");
const applicant_service_1 = require("../services/applicant.service");
const applicant_dto_1 = require("../../dto/applicant.dto");
let ApplyController = class ApplyController {
    /**
     * @openapi
     * /apply:
     *   post:
     *     tags: [Public / Apply]
     *     summary: Submit a campus ambassador application
     */
    async submit(body) {
        return this.applicantService.create(body);
    }
    /**
     * @openapi
     * /apply/check:
     *   get:
     *     tags: [Public / Apply]
     *     summary: Duplicate check by email / phone
     */
    async check(email, phone) {
        return this.applicantService.checkDuplicate(email, phone);
    }
};
exports.ApplyController = ApplyController;
tslib_1.__decorate([
    (0, typedi_1.Inject)(),
    tslib_1.__metadata("design:type", applicant_service_1.ApplicantService)
], ApplyController.prototype, "applicantService", void 0);
tslib_1.__decorate([
    (0, routing_controllers_1.Post)("/"),
    (0, routing_controllers_openapi_1.ResponseSchema)(applicants_1.Applicant),
    tslib_1.__param(0, (0, routing_controllers_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [applicant_dto_1.CreateApplicantInput]),
    tslib_1.__metadata("design:returntype", Promise)
], ApplyController.prototype, "submit", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)("/check"),
    tslib_1.__param(0, (0, routing_controllers_1.QueryParam)("email")),
    tslib_1.__param(1, (0, routing_controllers_1.QueryParam)("phone")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ApplyController.prototype, "check", null);
exports.ApplyController = ApplyController = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/apply")
], ApplyController);
//# sourceMappingURL=ApplyController.js.map