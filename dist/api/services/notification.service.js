"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const Logger_1 = require("../../decorators/Logger");
const InboxRepository_1 = require("../repositories/InboxRepository");
const errors_1 = require("../errors");
let NotificationService = class NotificationService {
    constructor(repository, log) {
        this.repository = repository;
        this.log = log;
    }
    async sendMessage(input) {
        const msg = this.repository.repository.create({
            id: `MSG-${Date.now()}`,
            from: input.from,
            subject: input.subject,
            preview: input.preview ?? input.body.slice(0, 80),
            body: input.body,
            receivedOn: new Date().toISOString(),
            read: false,
            priority: input.priority ?? "Normal",
        });
        return this.repository.repository.save(msg);
    }
    async archive(msgId) {
        const repo = this.repository.repository;
        const msg = await repo.findOne({ where: { id: msgId } });
        if (!msg)
            throw new errors_1.NotFoundError(`Message ${msgId} not found`);
        await repo.remove(msg);
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__param(1, (0, Logger_1.Logger)(__filename)),
    tslib_1.__metadata("design:paramtypes", [InboxRepository_1.InboxRepository, Object])
], NotificationService);
//# sourceMappingURL=notification.service.js.map