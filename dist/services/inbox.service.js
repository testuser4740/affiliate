"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InboxService = void 0;
const typedi_1 = require("typedi");
const data_source_1 = require("../data-source");
const inbox_messages_1 = require("../entities/inbox-messages");
const exceptions_1 = require("../exceptions");
let InboxService = class InboxService {
    repo() {
        return data_source_1.AppDataSource.getRepository(inbox_messages_1.InboxMessage);
    }
    async list(ambassadorId, unread) {
        void ambassadorId;
        const where = {};
        if (unread)
            where.read = false;
        return this.repo().find({ where, order: { receivedOn: "DESC" } });
    }
    async getById(msgId) {
        const msg = await this.repo().findOne({ where: { id: msgId } });
        if (!msg)
            throw new exceptions_1.NotFoundError(`Message ${msgId} not found`);
        return msg;
    }
    async markRead(msgId) {
        const repo = this.repo();
        const msg = await this.getById(msgId);
        msg.read = true;
        return repo.save(msg);
    }
};
exports.InboxService = InboxService;
exports.InboxService = InboxService = __decorate([
    (0, typedi_1.Service)()
], InboxService);
//# sourceMappingURL=inbox.service.js.map