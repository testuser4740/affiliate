"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseModel = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
class BaseModel {
}
exports.BaseModel = BaseModel;
tslib_1.__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    tslib_1.__metadata("design:type", String)
], BaseModel.prototype, "createdBy", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: 'created_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    tslib_1.__metadata("design:type", Date)
], BaseModel.prototype, "createdDate", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.Column)({ name: 'modified_by', nullable: true }),
    tslib_1.__metadata("design:type", String)
], BaseModel.prototype, "modifiedBy", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ name: 'modified_date', type: 'timestamp', nullable: true }),
    tslib_1.__metadata("design:type", Date)
], BaseModel.prototype, "modifiedDate", void 0);
//# sourceMappingURL=BaseModel.js.map