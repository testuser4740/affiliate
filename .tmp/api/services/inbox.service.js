"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InboxService = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const Logger_1 = require("../../decorators/Logger");
const InboxRepository_1 = require("../repositories/InboxRepository");
const errors_1 = require("../errors");
let InboxService = class InboxService {
    constructor(repository, log) {
        this.repository = repository;
        this.log = log;
    }
    async list(ambassadorId, unread) {
        void ambassadorId;
        const where = {};
        if (unread)
            where.read = false;
        return this.repository.repository.find({ where, order: { receivedOn: "DESC" } });
    }
    async getById(msgId) {
        const msg = await this.repository.repository.findOne({ where: { id: msgId } });
        if (!msg)
            throw new errors_1.NotFoundError(`Message ${msgId} not found`);
        return msg;
    }
    async markRead(msgId) {
        const repo = this.repository.repository;
        const msg = await this.getById(msgId);
        msg.read = true;
        return repo.save(msg);
    }
};
exports.InboxService = InboxService;
exports.InboxService = InboxService = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__param(1, (0, Logger_1.Logger)(__filename)),
    tslib_1.__metadata("design:paramtypes", [InboxRepository_1.InboxRepository, Object])
], InboxService);
//# sourceMappingURL=inbox.service.js.map