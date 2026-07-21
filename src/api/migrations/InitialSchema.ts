import { MigrationInterface, QueryRunner } from "typeorm";

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
export class InitialSchema0000000000000 implements MigrationInterface {
  public async up(_queryRunner: QueryRunner): Promise<void> {
    // No-op: schema is managed via synchronize in development.
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // No-op.
  }
}
