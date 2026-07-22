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
import { Poc } from "../../models/pocs";
import { PocService } from "../../services/poc.service";
import { ApiList } from "../../types";
import { CreatePocInput, UpdatePocInput, UpdatePocAmbassadorsInput } from "../../../dto/poc.dto";

@Service()
@JsonController("/admin/pocs")
export class PocController {
  @Inject()
  private service!: PocService;

  @Get("/")
  @Authorized(["admin", "ambassador"])
  @ResponseSchema(Poc, { isArray: true })
  async list(
    @QueryParam("region") region?: string,
    @QueryParam("role") role?: string,
    @QueryParam("q") q?: string,
  ): Promise<ApiList<Poc>> {
    return this.service.list({ region, role, q });
  }

  @Get("/:id")
  @Authorized(["admin", "ambassador"])
  @ResponseSchema(Poc)
  async get(@Param("id") id: string): Promise<Poc> {
    return this.service.getById(id);
  }

  @Post("/")
  @Authorized("admin")
  @ResponseSchema(Poc)
  async create(@Body() body: CreatePocInput): Promise<Poc> {
    return this.service.create(body);
  }

  @Put("/:id")
  @Authorized("admin")
  @ResponseSchema(Poc)
  async update(@Param("id") id: string, @Body() body: UpdatePocInput): Promise<Poc> {
    return this.service.update(id, body);
  }

  @Delete("/:id")
  @Authorized("admin")
  @OnUndefined(204)
  async remove(@Param("id") id: string): Promise<void> {
    return this.service.remove(id);
  }

  @Post("/:id/ambassadors")
  @Authorized("admin")
  @ResponseSchema(Poc)
  async updateAmbassadors(@Param("id") id: string, @Body() body: UpdatePocAmbassadorsInput): Promise<Poc> {
    return this.service.updateAmbassadors(id, body.linkedAffiliates);
  }
}