"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmbassadorInboxController = void 0;
const tslib_1 = require("tslib");
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const inbox_messages_1 = require("../../models/inbox-messages");
const inbox_service_1 = require("../../services/inbox.service");
let AmbassadorInboxController = class AmbassadorInboxController {
    /**
     * @openapi
     * /ambassador/{ambassadorId}/inbox:
     *   get:
     *     tags: [Ambassador / Inbox]
     *     summary: Own inbox messages
     */
    async inbox(ambassadorId, unread) {
        return this.service.list(ambassadorId, unread);
    }
    async inboxMessage(msgId) {
        return this.service.getById(msgId);
    }
    /**
     * @openapi
     * /ambassador/{ambassadorId}/inbox/:msgId/read:
     *   post:
     *     tags: [Ambassador / Inbox]
     *     summary: Mark a message as read
     */
    async markRead(msgId) {
        return this.service.markRead(msgId);
    }
};
exports.AmbassadorInboxController = AmbassadorInboxController;
tslib_1.__decorate([
    (0, typedi_1.Inject)(),
    tslib_1.__metadata("design:type", inbox_service_1.InboxService)
], AmbassadorInboxController.prototype, "service", void 0);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)("/:ambassadorId/inbox"),
    (0, routing_controllers_openapi_1.ResponseSchema)(inbox_messages_1.InboxMessage, { isArray: true }),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("ambassadorId")),
    tslib_1.__param(1, (0, routing_controllers_1.QueryParam)("unread")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Boolean]),
    tslib_1.__metadata("design:returntype", Promise)
], AmbassadorInboxController.prototype, "inbox", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Get)("/:ambassadorId/inbox/:msgId"),
    (0, routing_controllers_openapi_1.ResponseSchema)(inbox_messages_1.InboxMessage),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("msgId")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AmbassadorInboxController.prototype, "inboxMessage", null);
tslib_1.__decorate([
    (0, routing_controllers_1.Post)("/:ambassadorId/inbox/:msgId/read"),
    (0, routing_controllers_openapi_1.ResponseSchema)(inbox_messages_1.InboxMessage),
    tslib_1.__param(0, (0, routing_controllers_1.Param)("msgId")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AmbassadorInboxController.prototype, "markRead", null);
exports.AmbassadorInboxController = AmbassadorInboxController = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/ambassador")
], AmbassadorInboxController);
//# sourceMappingURL=InboxController.js.map