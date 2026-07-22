import {
  JsonController,
  Get,
  Post,
  Put,
  Delete,
  Param,
  QueryParam,
  Body,
  OnUndefined,
  Authorized
} from "routing-controllers";
import { Service, Inject } from "typedi";
import { ResponseSchema } from "routing-controllers-openapi";
import { AffiliateUrl } from "../../models/affiliate-urls";
import { AffiliateUrlService } from "../../services/affiliate-url.service";
import { ApiList } from "../../types";
import {
  CreateAffiliateUrlInput,
  UpdateAffiliateUrlInput,
} from "../../../dto/affiliate-url.dto";

@Service()
@Authorized("admin")
@JsonController("/admin/affiliate-urls")
export class AffiliateUrlController {
  @Inject()
  private service!: AffiliateUrlService;

  /**
   * @openapi
   * /admin/affiliate-urls:
   *   get:
   *     tags: [Admin / Affiliate URLs]
   *     summary: List affiliate URLs
   */
  @Get("/")
  @ResponseSchema(AffiliateUrl, { isArray: true })
  async list(
    @QueryParam("ambassadorId") ambassadorId?: string,
    @QueryParam("channel") channel?: string,
    @QueryParam("q") q?: string,
  ): Promise<ApiList<AffiliateUrl>> {
    return this.service.list({ ambassadorId, channel, q });
  }

  @Get("/:id")
  @ResponseSchema(AffiliateUrl)
  async get(@Param("id") id: string): Promise<AffiliateUrl> {
    return this.service.getById(id);
  }

  /**
   * @openapi
   * /admin/affiliate-urls:
   *   post:
   *     tags: [Admin / Affiliate URLs]
   *     summary: Create an affiliate URL
   *     requestBody:
   *       required: true
   *       content: {
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateAffiliateUrlInput'
   *       }
   */
  @Post("/")
  @ResponseSchema(AffiliateUrl)
  async create(@Body() body: CreateAffiliateUrlInput): Promise<AffiliateUrl> {
    return this.service.create(body);
  }

  /**
   * @openapi
   * /admin/affiliate-urls/{id}:
   *   put:
   *     tags: [Admin / Affiliate URLs]
   *     summary: Update an affiliate URL
   *     requestBody:
   *       required: true
   *       content: {
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateAffiliateUrlInput'
   *       }
   */
  @Put("/:id")
  @ResponseSchema(AffiliateUrl)
  async update(@Param("id") id: string, @Body() body: UpdateAffiliateUrlInput): Promise<AffiliateUrl> {
    return this.service.update(id, body);
  }

  @Delete("/:id")
  @OnUndefined(204)
  async remove(@Param("id") id: string): Promise<void> {
    return this.service.remove(id);
  }
}
