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
import { Announcement } from "../../models/announcements";
import { AnnouncementService } from "../../services/announcement.service";
import { ApiList } from "../../types";
import {
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
} from "../../../dto/announcement.dto";

@Service()
@Authorized("admin")
@JsonController("/admin/announcements")
export class AnnouncementController {
  @Inject()
  private service!: AnnouncementService;

  @Get("/")
  @ResponseSchema(Announcement, { isArray: true })
  async list(
    @QueryParam("audience") audience?: string,
    @QueryParam("priority") priority?: string,
    @QueryParam("tier") tier?: string,
    @QueryParam("city") city?: string,
    @QueryParam("state") state?: string,
  ): Promise<ApiList<Announcement>> {
    return this.service.list(audience, priority, tier, city, state);
  }

  @Get("/:id")
  @ResponseSchema(Announcement)
  async get(@Param("id") id: string): Promise<Announcement> {
    return this.service.getById(id);
  }

  /**
   * @openapi
   * /admin/announcements:
   *   post:
   *     tags: [Admin / Announcements]
   *     summary: Create & send an announcement
   */
  @Post("/")
  @ResponseSchema(Announcement)
  async create(@Body() body: CreateAnnouncementInput): Promise<Announcement> {
    return this.service.create(body);
  }

  @Put("/:id")
  @ResponseSchema(Announcement)
  async update(@Param("id") id: string, @Body() body: UpdateAnnouncementInput): Promise<Announcement> {
    return this.service.update(id, body);
  }

  @Delete("/:id")
  @OnUndefined(204)
  async remove(@Param("id") id: string): Promise<void> {
    return this.service.remove(id);
  }

  @Get("/:id/read-count")
  async getReadCount(@Param("id") id: string): Promise<{ readCount: number }> {
    const count = await this.service.getReadCount(id);
    return { readCount: count };
  }
}
