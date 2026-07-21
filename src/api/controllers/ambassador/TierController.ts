import {
  JsonController,
  Get,
  Param,
  Authorized
} from "routing-controllers";
import { Service, Inject } from "typedi";
import { Ambassador } from "../../models/ambassadors";
import { AmbassadorService } from "../../services/ambassador.service";
import { TierService } from "../../services/tier.service";

@Service()
@Authorized("ambassador")
@JsonController("/ambassador")
export class AmbassadorTierController {
  @Inject()
  private ambassadors!: AmbassadorService;

  @Inject()
  private tiers!: TierService;

  /**
   * @openapi
   * /ambassador/{ambassadorId}/tier:
   *   get:
   *     tags: [Ambassador / Tier]
   *     summary: Own tier + progression to next tier
   */
  @Get("/:ambassadorId/tier")
  async tier(@Param("ambassadorId") ambassadorId: string) {
    const ambassador = await this.ambassadors.getById(ambassadorId);
    const allTiers = await this.tiers.list();
    const { current, next, progressToNext } = this.tiers.resolveProgression(
      Number(ambassador.revenue ?? 0),
      allTiers,
    );

    return {
      ambassador: {
        id: ambassador.id,
        name: ambassador.name,
        tier: ambassador.tier,
        revenue: ambassador.revenue,
        commissionPct: ambassador.commissionPct,
      },
      currentTier: current ?? null,
      nextTier: next ?? null,
      progressToNext,
      allTiers,
    };
  }
}
