"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InboxMessage = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
let InboxMessage = class InboxMessage {
};
exports.InboxMessage = InboxMessage;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: "id", type: "varchar", length: 32 }),
    tslib_1.__metadata("design:type", String)
], InboxMessage.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    tslib_1.__metadata("design:type", String)
], InboxMessage.prototype, "from", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 255 }),
    tslib_1.__metadata("design:type", String)
], InboxMessage.prototype, "subject", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 512, nullable: true }),
    tslib_1.__metadata("design:type", String)
], InboxMessage.prototype, "preview", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "text" }),
    tslib_1.__metadata("design:type", String)
], InboxMessage.prototype, "body", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: "received_on", type: "varchar", length: 64 }),
    tslib_1.__metadata("design:type", String)
], InboxMessage.prototype, "receivedOn", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "boolean", default: false }),
    tslib_1.__metadata("design:type", Boolean)
], InboxMessage.prototype, "read", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 32, default: "Normal" }),
    tslib_1.__metadata("design:type", String)
], InboxMessage.prototype, "priority", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "created_at" }),
    tslib_1.__metadata("design:type", Date)
], InboxMessage.prototype, "createdAt", void 0);
exports.InboxMessage = InboxMessage = tslib_1.__decorate([
    (0, typeorm_1.Entity)("inbox_messages")
], InboxMessage);
//# sourceMappingURL=inbox-messages.js.map