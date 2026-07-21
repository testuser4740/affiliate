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
exports.ApplyController = void 0;
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const applicants_1 = require("../entities/applicants");
const applicant_service_1 = require("../services/applicant.service");
const applicant_dto_1 = require("../dto/applicant.dto");
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
__decorate([
    (0, typedi_1.Inject)(),
    __metadata("design:type", applicant_service_1.ApplicantService)
], ApplyController.prototype, "applicantService", void 0);
__decorate([
    (0, routing_controllers_1.Post)("/"),
    (0, routing_controllers_openapi_1.ResponseSchema)(applicants_1.Applicant),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [applicant_dto_1.CreateApplicantInput]),
    __metadata("design:returntype", Promise)
], ApplyController.prototype, "submit", null);
__decorate([
    (0, routing_controllers_1.Get)("/check"),
    __param(0, (0, routing_controllers_1.QueryParam)("email")),
    __param(1, (0, routing_controllers_1.QueryParam)("phone")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ApplyController.prototype, "check", null);
exports.ApplyController = ApplyController = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/apply")
], ApplyController);
//# sourceMappingURL=apply.js.map