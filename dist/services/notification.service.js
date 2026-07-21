"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const typedi_1 = require("typedi");
const data_source_1 = require("../data-source");
const inbox_messages_1 = require("../entities/inbox-messages");
const exceptions_1 = require("../exceptions");
let NotificationService = class NotificationService {
    inboxRepo() {
        return data_source_1.AppDataSource.getRepository(inbox_messages_1.InboxMessage);
    }
    async sendMessage(input) {
        const msg = this.inboxRepo().create({
            id: `MSG-${Date.now()}`,
            from: input.from,
            subject: input.subject,
            preview: input.preview ?? input.body.slice(0, 80),
            body: input.body,
            receivedOn: new Date().toISOString(),
            read: false,
            priority: input.priority ?? "Normal",
        });
        return this.inboxRepo().save(msg);
    }
    async archive(msgId) {
        const repo = this.inboxRepo();
        const msg = await repo.findOne({ where: { id: msgId } });
        if (!msg)
            throw new exceptions_1.NotFoundError(`Message ${msgId} not found`);
        await repo.remove(msg);
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, typedi_1.Service)()
], NotificationService);
//# sourceMappingURL=notification.service.js.map