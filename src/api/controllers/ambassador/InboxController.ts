import {
  JsonController,
  Get,
  Post,
  Param,
  QueryParam,
  Body,
  Authorized
} from "routing-controllers";
import { Service, Inject } from "typedi";
import { ResponseSchema } from "routing-controllers-openapi";
import { InboxMessage } from "../../models/inbox-messages";
import { InboxService } from "../../services/inbox.service";

@Service()
@Authorized("ambassador")
@JsonController("/ambassador")
export class AmbassadorInboxController {
  @Inject()
  private service!: InboxService;

  /**
   * @openapi
   * /ambassador/{ambassadorId}/inbox:
   *   get:
   *     tags: [Ambassador / Inbox]
   *     summary: Own inbox messages
   */
  @Get("/:ambassadorId/inbox")
  @ResponseSchema(InboxMessage, { isArray: true })
  async inbox(
    @Param("ambassadorId") ambassadorId: string,
    @QueryParam("unread") unread?: boolean,
  ): Promise<InboxMessage[]> {
    return this.service.list(ambassadorId, unread);
  }

  @Get("/:ambassadorId/inbox/:msgId")
  @ResponseSchema(InboxMessage)
  async inboxMessage(@Param("msgId") msgId: string): Promise<InboxMessage> {
    return this.service.getById(msgId);
  }

  /**
   * @openapi
   * /ambassador/{ambassadorId}/inbox/{msgId}/read:
   *   post:
   *     tags: [Ambassador / Inbox]
   *     summary: Mark a message as read
   */
  @Post("/:ambassadorId/inbox/:msgId/read")
  @ResponseSchema(InboxMessage)
  async markRead(@Param("msgId") msgId: string): Promise<InboxMessage> {
    return this.service.markRead(msgId);
  }
}