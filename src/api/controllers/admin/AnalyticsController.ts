import {
  JsonController,
  Get,
  QueryParam,
  Authorized
} from "routing-controllers";
import { Service, Inject } from "typedi";
import { ResponseSchema } from "routing-controllers-openapi";
import { ActivityLog } from "../../models/activity-logs";
import { AnalyticsService } from "../../services/analytics.service";

@Service()
@Authorized("admin")
@JsonController("/admin/analytics")
export class AnalyticsController {
  @Inject()
  private service!: AnalyticsService;

  /**
   * @openapi
   * /admin/analytics/kpis:
   *   get:
   *     tags: [Admin / Analytics]
   *     summary: KPI summary
   */
  /**
   * @openapi
   * /admin/analytics/kpis:
   *   get:
   *     tags: [Admin / Analytics]
   *     summary: KPI summary
   */
  @Get("/kpis")
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
  @Get("/trend")
  @ResponseSchema(ActivityLog, { isArray: true })
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
  @Get("/activity")
  @ResponseSchema(ActivityLog, { isArray: true })
  async activity(@QueryParam("from") from?: string, @QueryParam("to") to?: string) {
    return this.service.activity(from, to);
  }
}
