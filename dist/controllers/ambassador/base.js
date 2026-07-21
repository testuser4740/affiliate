"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ambassadorRepo = ambassadorRepo;
exports.requireAmbassador = requireAmbassador;
const ambassadors_1 = require("../../entities/ambassadors");
const base_1 = require("../base");
function ambassadorRepo() {
    return (0, base_1.getRepo)(ambassadors_1.Ambassador);
}
async function requireAmbassador(ambassadorId) {
    const ambassador = await ambassadorRepo().findOne({ where: { id: ambassadorId } });
    if (!ambassador)
        throw new base_1.NotFoundError(`Ambassador ${ambassadorId} not found`);
    return ambassador;
}
//# sourceMappingURL=base.js.map