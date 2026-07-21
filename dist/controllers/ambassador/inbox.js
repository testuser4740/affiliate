"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmbassadorInboxController = void 0;
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = require("typedi");
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
const inbox_messages_1 = require("../../entities/inbox-messages");
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
__decorate([
    (0, typedi_1.Inject)(),
    __metadata("design:type", inbox_service_1.InboxService)
], AmbassadorInboxController.prototype, "service", void 0);
__decorate([
    (0, routing_controllers_1.Get)("/:ambassadorId/inbox"),
    (0, routing_controllers_openapi_1.ResponseSchema)(inbox_messages_1.InboxMessage, { isArray: true }),
    __param(0, (0, routing_controllers_1.Param)("ambassadorId")),
    __param(1, (0, routing_controllers_1.QueryParam)("unread")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], AmbassadorInboxController.prototype, "inbox", null);
__decorate([
    (0, routing_controllers_1.Get)("/:ambassadorId/inbox/:msgId"),
    (0, routing_controllers_openapi_1.ResponseSchema)(inbox_messages_1.InboxMessage),
    __param(0, (0, routing_controllers_1.Param)("msgId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AmbassadorInboxController.prototype, "inboxMessage", null);
__decorate([
    (0, routing_controllers_1.Post)("/:ambassadorId/inbox/:msgId/read"),
    (0, routing_controllers_openapi_1.ResponseSchema)(inbox_messages_1.InboxMessage),
    __param(0, (0, routing_controllers_1.Param)("msgId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AmbassadorInboxController.prototype, "markRead", null);
exports.AmbassadorInboxController = AmbassadorInboxController = __decorate([
    (0, typedi_1.Service)(),
    (0, routing_controllers_1.JsonController)("/ambassador")
], AmbassadorInboxController);
//# sourceMappingURL=inbox.js.map