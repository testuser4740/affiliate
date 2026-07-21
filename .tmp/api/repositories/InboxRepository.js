"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InboxRepository = void 0;
const tslib_1 = require("tslib");
const typedi_1 = require("typedi");
const inbox_messages_1 = require("../models/inbox-messages");
const typeormLoader_1 = require("../../loaders/typeormLoader");
let InboxRepository = class InboxRepository {
    constructor() {
        this.repository = (0, typeormLoader_1.getConnection)().getRepository(inbox_messages_1.InboxMessage);
    }
};
exports.InboxRepository = InboxRepository;
exports.InboxRepository = InboxRepository = tslib_1.__decorate([
    (0, typedi_1.Service)(),
    tslib_1.__metadata("design:paramtypes", [])
], InboxRepository);
//# sourceMappingURL=InboxRepository.js.map