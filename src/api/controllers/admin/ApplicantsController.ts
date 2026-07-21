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
import { Applicant } from "../../models/applicants";
import { Ambassador } from "../../models/ambassadors";
import { ApplicantService } from "../../services/applicant.service";
import { ApiList } from "../../types";
import {
  CreateApplicantInput,
  UpdateApplicantInput,
  ApplicantActionInput,
  ConvertApplicantInput,
} from "../../../dto/applicant.dto";
import { ApplicantFilter } from "../../repositories/ApplicantRepository";

@Service()
@Authorized("admin")
@JsonController("/admin/applicants")
export class ApplicantController {
  @Inject()
  private service!: ApplicantService;

  /**
   * @openapi
   * /admin/applicants:
   *   get:
   *     tags: [Admin / Applicants]
   *     summary: List applicants (filters: q, status, state, city)
   */
  @Get("/")
  @ResponseSchema(Applicant, { isArray: true })
  async list(
    @QueryParam("q") q?: string,
    @QueryParam("status") status?: string,
    @QueryParam("state") state?: string,
    @QueryParam("city") city?: string,
  ): Promise<ApiList<Applicant>> {
    const filter: ApplicantFilter = { q, status, state, city };
    return this.service.list(filter);
  }

  @Get("/:id")
  @ResponseSchema(Applicant)
  async get(@Param("id") id: string): Promise<Applicant> {
    return this.service.getById(id);
  }

  @Post("/")
  @ResponseSchema(Applicant)
  async create(@Body() body: CreateApplicantInput): Promise<Applicant> {
    return this.service.create(body);
  }

  @Put("/:id")
  @ResponseSchema(Applicant)
  async update(@Param("id") id: string, @Body() body: UpdateApplicantInput): Promise<Applicant> {
    return this.service.update(id, body);
  }

  @Delete("/:id")
  @OnUndefined(204)
  async remove(@Param("id") id: string): Promise<void> {
    return this.service.remove(id);
  }

  /**
   * @openapi
   * /admin/applicants/{id}/approve:
   *   post:
   *     tags: [Admin / Applicants]
   *     summary: Approve an applicant (sets 5% default commission)
   */
  @Post("/:id/approve")
  @ResponseSchema(Applicant)
  async approve(@Param("id") id: string): Promise<Applicant> {
    return this.service.approve(id);
  }

  @Post("/:id/partial")
  @ResponseSchema(Applicant)
  async partial(@Param("id") id: string, @Body() body: ApplicantActionInput): Promise<Applicant> {
    return this.service.partiallyApprove(id, body);
  }

  @Post("/:id/reject")
  @ResponseSchema(Applicant)
  async reject(@Param("id") id: string, @Body() body: ApplicantActionInput): Promise<Applicant> {
    return this.service.reject(id, body);
  }

  /**
   * @openapi
   * /admin/applicants/{id}/convert:
   *   post:
   *     tags: [Admin / Applicants]
   *     summary: Convert an approved applicant into an Ambassador + login User
   */
  @Post("/:id/convert")
  @ResponseSchema(Ambassador)
  async convert(@Param("id") id: string, @Body() body: ConvertApplicantInput): Promise<Ambassador> {
    return this.service.convertToAmbassador(id, body.password, body);
  }
}
