import {
  JsonController,
  Get,
  Param,
  QueryParam,
  Authorized
} from "routing-controllers";
import { Service, Inject } from "typedi";
import { ResponseSchema } from "routing-controllers-openapi";
import { Payout } from "../../models/payouts";
import { PayoutService } from "../../services/payout.service";

@Service()
@Authorized("ambassador")
@JsonController("/ambassador")
export class AmbassadorPayoutController {
  @Inject()
  private service!: PayoutService;

  /**
   * @openapi
   * /ambassador/{ambassadorId}/payouts:
   *   get:
   *     tags: [Ambassador / Payouts]
   *     summary: Own payout cycles
   */
  @Get("/:ambassadorId/payouts")
  @ResponseSchema(Payout, { isArray: true })
  async payouts(
    @Param("ambassadorId") ambassadorId: string,
    @QueryParam("month") month?: string,
  ): Promise<Payout[]> {
    return this.service.list(ambassadorId, month);
  }
}
