import {
  JsonController,
  Get,
  Put,
  Param,
  QueryParam,
  Body,
  Post,
  Authorized
} from "routing-controllers";
import { Service, Inject } from "typedi";
import { ResponseSchema } from "routing-controllers-openapi";
import { Ambassador } from "../../models/ambassadors";
import { AmbassadorService } from "../../services/ambassador.service";
import { ApiList } from "../../types";
import { UpdateAmbassadorInput } from "../../../dto/ambassador.dto";
import { InboxMessage } from "../../models/inbox-messages";
import { InboxService } from "../../services/inbox.service";

@Service()
@Authorized("admin")
@JsonController("/admin/ambassadors")
export class AmbassadorController {
  @Inject()
  private service!: AmbassadorService;
  @Inject()
  private inboxService!: InboxService;

  @Get("/")
  @ResponseSchema(Ambassador, { isArray: true })
  async list(
    @QueryParam("tier") tier?: string,
    @QueryParam("state") state?: string,
    @QueryParam("city") city?: string,
    @QueryParam("q") q?: string,
  ): Promise<ApiList<Ambassador>> {
    return this.service.list({ tier, state, city, q });
  }

  /**
   * @openapi
   * /admin/ambassadors/leaderboard:
   *   get:
   *     tags: [Admin / Directory]
   *     summary: Master leaderboard ranked by revenue
   */
  @Get("/leaderboard")
  @ResponseSchema(Ambassador, { isArray: true })
  async leaderboard(@QueryParam("state") state?: string): Promise<ApiList<Ambassador>> {
    return this.service.leaderboard(state);
  }

  @Get("/:id")
  @ResponseSchema(Ambassador)
  async get(@Param("id") id: string): Promise<Ambassador> {
    return this.service.getById(id);
  }

  @Put("/:id")
  @ResponseSchema(Ambassador)
  async update(@Param("id") id: string, @Body() body: UpdateAmbassadorInput): Promise<Ambassador> {
    return this.service.update(id, body);
  }

  @Post("/:id/inbox")
  @ResponseSchema(InboxMessage)
  async sendMessage(@Param("id") ambassadorId: string, @Body() body: { from: string; subject: string; body: string }): Promise<InboxMessage> {
    return this.inboxService.create({
      ambassadorId,
      from: body.from,
      subject: body.subject,
      body: body.body,
    });
  }
}
