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
import { CommissionOverride } from "../../models/commission-overrides";
import { CommissionOverrideService } from "../../services/commission-override.service";
import { ApiList } from "../../types";
import {
  CreateCommissionOverrideInput,
  UpdateCommissionOverrideInput,
} from "../../../dto/commission-override.dto";

@Service()
@Authorized("admin")
@JsonController("/admin/commission-overrides")
export class CommissionOverrideController {
  @Inject()
  private service!: CommissionOverrideService;

  @Get("/")
  @ResponseSchema(CommissionOverride, { isArray: true })
  async list(
    @QueryParam("status") status?: string,
    @QueryParam("q") q?: string,
  ): Promise<ApiList<CommissionOverride>> {
    return this.service.list({ status, q });
  }

  @Get("/:id")
  @ResponseSchema(CommissionOverride)
  async get(@Param("id") id: string): Promise<CommissionOverride> {
    return this.service.getById(id);
  }

  /**
   * @openapi
   * /admin/commission-overrides:
   *   post:
   *     tags: [Admin / Commission Overrides]
   *     summary: Create a commission override
   *     requestBody:
   *       required: true
   *       content: {
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateCommissionOverrideInput'
   *       }
   */
  @Post("/")
  @ResponseSchema(CommissionOverride)
  async create(@Body() body: CreateCommissionOverrideInput): Promise<CommissionOverride> {
    return this.service.create(body);
  }

  /**
   * @openapi
   * /admin/commission-overrides/{id}:
   *   put:
   *     tags: [Admin / Commission Overrides]
   *     summary: Update a commission override
   *     requestBody:
   *       required: true
   *       content: {
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateCommissionOverrideInput'
   *       }
   */
  @Put("/:id")
  @ResponseSchema(CommissionOverride)
  async update(@Param("id") id: string, @Body() body: UpdateCommissionOverrideInput): Promise<CommissionOverride> {
    return this.service.update(id, body);
  }

  @Delete("/:id")
  @OnUndefined(204)
  async remove(@Param("id") id: string): Promise<void> {
    return this.service.remove(id);
  }
}
