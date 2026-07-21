import {
  JsonController,
  Get,
  Post,
  Param,
  QueryParam,
  Authorized
} from "routing-controllers";
import { Service, Inject } from "typedi";
import { ResponseSchema } from "routing-controllers-openapi";
import { Announcement } from "../../models/announcements";
import { AnnouncementService } from "../../services/announcement.service";
import { AmbassadorService } from "../../services/ambassador.service";

@Service()
@Authorized("ambassador")
@JsonController("/ambassador")
export class AmbassadorAnnouncementController {
  @Inject()
  private service!: AnnouncementService;
  @Inject()
  private ambassadorService!: AmbassadorService;

  @Get("/:ambassadorId/announcements")
  @ResponseSchema(Announcement, { isArray: true })
  async announcements(
    @Param("ambassadorId") ambassadorId: string,
    @QueryParam("audience") audience?: string,
  ): Promise<Announcement[]> {
    return this.service.getForAmbassador(ambassadorId);
  }

  @Post("/:ambassadorId/announcements/:announcementId/read")
  async markRead(
    @Param("ambassadorId") ambassadorId: string,
    @Param("announcementId") announcementId: string,
  ): Promise<{ success: boolean }> {
    await this.service.markAsRead(announcementId, ambassadorId);
    return { success: true };
  }

  @Get("/:ambassadorId/announcements/:announcementId/read-status")
  async getReadStatus(
    @Param("ambassadorId") ambassadorId: string,
    @Param("announcementId") announcementId: string,
  ): Promise<{ isRead: boolean }> {
    return this.service.getReadStatus(announcementId, ambassadorId);
  }
}
