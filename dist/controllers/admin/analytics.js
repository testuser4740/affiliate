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
exports.AnalyticsController = void 0;
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const activity_logs_1 = require("../../entities/activity-logs");
const analytics_service_1 = require("../../services/analytics.service");
let AnalyticsController = class AnalyticsController {
    /**
     * @openapi
     * /admin/analytics/kpis:
     *   get:
     *     tags: [Admin / Analytics]
     *     summary: KPI summary
     */
    async kpis() {
        return this.service.kpis();
    }
    /**
     * @openapi
     * /admin/analytics/trend:
     *   get:
     *     tags: [Admin / Analytics]
     *     summary: Activity trend (ascending by date)
     */
    async trend() {
        return this.service.trend();
    }
    /**
     * @openapi
     * /admin/analytics/activity:
     *   get:
     *     tags: [Admin / Analytics]
     *     summary: Activity logs (date range: from, to)
     */
    async activity(from, to) {
        return this.service.activity(from, to);
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, typedi_1.Inject)(),
    __metadata("design:type", analytics_service_1.AnalyticsService)
], AnalyticsController.prototype, "service", void 0);
__decorate([
    (0, routing_controllers_1.Get)("/kpis"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "kpis", null);
__decorate([
    (0, routing_controllers_1.Get)("/trend"),
    (0, routing_controllers_openapi_1.ResponseSchema)(activity_logs_1.ActivityLog, { isArray: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "trend", null);
__decorate([
    (0, routing_controllers_1.Get)("/activity"),
    (0, routing_controllers_openapi_1.ResponseSchema)(activity_logs_1.ActivityLog, { isArray: true }),
    __param(0, (0, routing_controllers_1.QueryParam)("from")),
    __param(1, (0, routing_controllers_1.QueryParam)("to")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "activity", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/admin/analytics")
], AnalyticsController);
//# sourceMappingURL=analytics.js.map