import {
  JsonController,
  Post,
  Body,
  Get,
  QueryParam,
} from "routing-controllers";
import { Service, Inject } from "typedi";
import { ResponseSchema } from "routing-controllers-openapi";
import { Applicant } from "../models/applicants";
import { ApplicantService } from "../services/applicant.service";
import { CreateApplicantInput } from "../../dto/applicant.dto";

@Service()
@JsonController("/apply")
export class ApplyController {
  @Inject()
  private applicantService!: ApplicantService;

  /**
   * @openapi
   * /apply:
   *   post:
   *     tags: [Public / Apply]
   *     summary: Submit a campus ambassador application
   */
  @Post("/")
  @ResponseSchema(Applicant)
  async submit(@Body() body: CreateApplicantInput): Promise<Applicant> {
    return this.applicantService.create(body);
  }

  /**
   * @openapi
   * /apply/check:
   *   get:
   *     tags: [Public / Apply]
   *     summary: Duplicate check by email / phone
   */
  @Get("/check")
  async check(@QueryParam("email") email?: string, @QueryParam("phone") phone?: string) {
    return this.applicantService.checkDuplicate(email, phone);
  }
}
