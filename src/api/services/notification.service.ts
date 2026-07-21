import { Service } from "typedi";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { InboxMessage } from "../models/inbox-messages";
import { InboxRepository } from "../repositories/InboxRepository";
import { NotFoundError } from "../errors";

@Service()
export class NotificationService {
  constructor(
    private repository: InboxRepository,
    @Logger(__filename) private log: LoggerInterface,
  ) {}

    const msg = this.repository.repository.create({
      id: `MSG-${Date.now()}`,
      from: input.from,
      subject: input.subject,
      preview: input.preview ?? input.body.slice(0, 80),
      body: input.body,
      receivedOn: new Date().toISOString(),
      read: false,
      priority: input.priority ?? "Normal",
    } as Partial<InboxMessage>);
    return this.repository.repository.save(msg);
  }

  async archive(msgId: string): Promise<void> {
    const repo = this.repository.repository;
    const msg = await repo.findOne({ where: { id: msgId } });
    if (!msg) throw new NotFoundError(`Message ${msgId} not found`);
    await repo.remove(msg);
  }
}
