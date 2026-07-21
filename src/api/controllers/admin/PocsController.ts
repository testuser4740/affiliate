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
import { CreatePocInput, UpdatePocInput } from "../../../dto/poc.dto";

@Service()
@Authorized("admin")
@JsonController("/admin/pocs")
export class PocController {
  @Inject()
  private service!: PocService;

  @Get("/")
  @ResponseSchema(Poc, { isArray: true })
  async list(
    @QueryParam("region") region?: string,
    @QueryParam("role") role?: string,
    @QueryParam("q") q?: string,
  ): Promise<ApiList<Poc>> {
    return this.service.list({ region, role, q });
  }

  @Get("/:id")
  @ResponseSchema(Poc)
  async get(@Param("id") id: string): Promise<Poc> {
    return this.service.getById(id);
  }

  @Post("/")
  @ResponseSchema(Poc)
  async create(@Body() body: CreatePocInput): Promise<Poc> {
    return this.service.create(body);
  }

  @Put("/:id")
  @ResponseSchema(Poc)
  async update(@Param("id") id: string, @Body() body: UpdatePocInput): Promise<Poc> {
    return this.service.update(id, body);
  }

  @Delete("/:id")
  @OnUndefined(204)
  async remove(@Param("id") id: string): Promise<void> {
    return this.service.remove(id);
  }
}
