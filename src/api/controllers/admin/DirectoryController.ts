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
import { CreateAmbassadorInput, UpdateAmbassadorInput } from "../../../dto/ambassador.dto";
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

  @Post("/")
  @ResponseSchema(Ambassador)
  async create(@Body({ validate: true }) body: CreateAmbassadorInput): Promise<Ambassador> {
    return this.service.create(body);
  }

  /**
   * @openapi
   * /admin/ambassadors/{id}:
   *   put:
   *     tags: [Admin / Directory]
   *     summary: Update ambassador profile or settings
   */
  @Put("/:id")
  @ResponseSchema(Ambassador)
  async update(@Param("id") id: string, @Body() body: UpdateAmbassadorInput): Promise<Ambassador> {
    return this.service.update(id, body);
  }

  /**
   * @openapi
   * /admin/ambassadors/{id}/inbox:
   *   post:
   *     tags: [Admin / Directory]
   *     summary: Send a message to an ambassador's inbox
   *     requestBody:
   *       required: true
   *       content: {
   *         application/json:
   *           schema:
   *             type: object
   *             required: [from, subject, body]
   *             properties:
   *               from: { type: string }
   *               subject: { type: string }
   *               body: { type: string }
   *       }
   */
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
