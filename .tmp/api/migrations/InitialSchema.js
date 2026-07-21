"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialSchema0000000000000 = void 0;
/**
 * Initial schema migration placeholder.
 *
 * The project uses `synchronize: true` in development (see src/data-source.ts),
 * so tables are created automatically. This migration is provided so the
 * `migrations` directory referenced by the DataSource exists and
 * `npm run migration:generate` can produce ordered, reviewable SQL for
 * production. Generate a concrete migration once a database is reachable:
 *
 *   npm run migration:generate -- -n InitialSchema
 *
 * It will produce a timestamped file in this directory.
 */
class InitialSchema0000000000000 {
    async up(_queryRunner) {
        // No-op: schema is managed via synchronize in development.
    }
    async down(_queryRunner) {
        // No-op.
    }
}
exports.InitialSchema0000000000000 = InitialSchema0000000000000;
//# sourceMappingURL=InitialSchema.js.map