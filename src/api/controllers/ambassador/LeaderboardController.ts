import {
  JsonController,
  Get,
  QueryParam,
} from "routing-controllers";
import { Service, Inject } from "typedi";
import { ResponseSchema } from "routing-controllers-openapi";
import { Ambassador } from "../../models/ambassadors";
import { AmbassadorService } from "../../services/ambassador.service";

@Service()
@JsonController("/ambassador")
export class AmbassadorLeaderboardController {
  @Inject()
  private service!: AmbassadorService;

  /**
   * @openapi
   * /ambassador/leaderboard:
   *   get:
   *     tags: [Ambassador / Leaderboard]
   *     summary: Public leaderboard (revenue ranking)
   */
  @Get("/leaderboard")
  @ResponseSchema(Ambassador, { isArray: true })
  async leaderboard(@QueryParam("state") state?: string): Promise<Ambassador[]> {
    return this.service.publicLeaderboard(state);
  }
}
