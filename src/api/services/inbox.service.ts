import { Service } from "typedi";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { InboxMessage } from "../models/inbox-messages";
import { InboxRepository } from "../repositories/InboxRepository";
import { NotFoundError } from "../errors";
import { liveBus } from "../lib/eventBus";

@Service()
export class InboxService {
  constructor(
    private repository: InboxRepository,
    @Logger(__filename) private log: LoggerInterface,
  ) {}

  async list(ambassadorId: string | null, unread?: boolean): Promise<InboxMessage[]> {
    const where: Record<string, unknown> = {};
    if (ambassadorId) where.ambassadorId = ambassadorId;
    if (unread) where.read = false;
    return this.repository.repository.find({ where, order: { receivedOn: "DESC" } });
  }

  async getById(msgId: string): Promise<InboxMessage> {
    const msg = await this.repository.repository.findOne({ where: { id: msgId } });
    if (!msg) throw new NotFoundError(`Message ${msgId} not found`);
    return msg;
  }

  async create(input: { ambassadorId: string; from: string; subject: string; preview?: string; body: string; priority?: string }): Promise<InboxMessage> {
    const msg = this.repository.repository.create({
      id: `MSG-${Date.now().toString(36)}`,
      ambassadorId: input.ambassadorId,
      from: input.from,
      subject: input.subject,
      preview: input.preview ?? input.body.slice(0, 120),
      body: input.body,
      receivedOn: new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
      read: false,
      priority: input.priority ?? "Normal",
    } as Partial<InboxMessage>);
    const saved = await this.repository.repository.save(msg);
    if (saved.ambassadorId) {
      liveBus.broadcast({ type: "inbox", ambassadorId: saved.ambassadorId });
    }
    return saved;
  }

  async markRead(msgId: string): Promise<InboxMessage> {
    const repo = this.repository.repository;
    const msg = await this.getById(msgId);
    msg.read = true;
    const saved = await repo.save(msg);
    if (saved.ambassadorId) {
      liveBus.broadcast({ type: "inbox", ambassadorId: saved.ambassadorId });
    }
    return saved;
  }
}
