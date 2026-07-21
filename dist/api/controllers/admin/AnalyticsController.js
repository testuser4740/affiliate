"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const tslib_1 = require("tslib");
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const activity_logs_1 = require("../../models/activity-logs");
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
tslib_1.__decorate([
    (0, typedi_1.Inject)(),
    tslib_1.__metadata("design:type", analytics_service_1.AnalyticsService)
], AnalyticsController.prototype, "service", void 0);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)("/kpis"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], AnalyticsController.prototype, "kpis", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)("/trend"),
    (0, routing_controllers_openapi_1.ResponseSchema)(activity_logs_1.ActivityLog, { isArray: true }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], AnalyticsController.prototype, "trend", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)("/activity"),
    (0, routing_controllers_openapi_1.ResponseSchema)(activity_logs_1.ActivityLog, { isArray: true }),
    tslib_1.__param(0, (0, routing_controllers_1.QueryParam)("from")),
    tslib_1.__param(1, (0, routing_controllers_1.QueryParam)("to")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], AnalyticsController.prototype, "activity", null);
exports.AnalyticsController = AnalyticsController = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/admin/analytics")
], AnalyticsController);
//# sourceMappingURL=AnalyticsController.js.map