import {
  JsonController,
  Get,
  Put,
  Param,
  Body,
  Authorized
} from "routing-controllers";
import { Service, Inject } from "typedi";
import { ResponseSchema } from "routing-controllers-openapi";
import { Ambassador } from "../../models/ambassadors";
import { DashboardService } from "../../services/dashboard.service";
import { AmbassadorService } from "../../services/ambassador.service";
import { UpdateAmbassadorInput } from "../../../dto/ambassador.dto";

@Service()
@Authorized("ambassador")
@JsonController("/ambassador")
export class AmbassadorHomeController {
  @Inject()
  private dashboard!: DashboardService;

  @Inject()
  private ambassadors!: AmbassadorService;

  /**
   * @openapi
   * /ambassador/{ambassadorId}/home:
   *   get:
   *     tags: [Ambassador / Home]
   *     summary: Own dashboard — profile, KPIs, URLs and recent orders
   */
  @Get("/:ambassadorId/home")
  async home(@Param("ambassadorId") ambassadorId: string) {
    return this.dashboard.home(ambassadorId);
  }

  /**
   * @openapi
   * /ambassador/{ambassadorId}/profile:
   *   get:
   *     tags: [Ambassador / Home]
   *     summary: Get own profile
   */
  @Get("/:ambassadorId/profile")
  @ResponseSchema(Ambassador)
  async profile(@Param("ambassadorId") ambassadorId: string): Promise<Ambassador> {
    return this.ambassadors.getById(ambassadorId);
  }

  @Put("/:ambassadorId/profile")
  @ResponseSchema(Ambassador)
  /**
   * @openapi
   * /ambassador/{ambassadorId}/profile:
   *   put:
   *     tags: [Ambassador / Home]
   *     summary: Update own profile
   *     requestBody:
   *       required: true
   *       content: {
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateAmbassadorInput'
   *       }
   */
  async updateProfile(
    @Param("ambassadorId") ambassadorId: string,
    @Body() body: UpdateAmbassadorInput,
  ): Promise<Ambassador> {
    return this.ambassadors.update(ambassadorId, body);
  }
}
