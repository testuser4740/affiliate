import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  Like,
} from "typeorm";

@Entity("commission_overrides")
export class CommissionOverride {
  @PrimaryColumn({ name: "id", type: "varchar", length: 32 })
  id: string;

  @Column({ type: "varchar", length: 255 })
  label: string;

  @Column({ name: "applies_to", type: "varchar", length: 128 })
  appliesTo: string;

  @Column({ name: "original_pct", type: "decimal", precision: 5, scale: 2, default: 0 })
  originalPct: number;

  @Column({ name: "override_pct", type: "decimal", precision: 5, scale: 2, default: 0 })
  overridePct: number;

  @Column({ name: "start_date", type: "date" })
  startDate: Date;

  @Column({ name: "end_date", type: "date" })
  endDate: Date;

  @Column({ name: "expires_at", type: "timestamp", nullable: true })
  expiresAt: Date;

  @Column({ type: "varchar", length: 32, default: "Scheduled" })
  status: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

@BeforeInsert()
    async generateId(): Promise<void> {
      if (this.id) {
        return;
      }
      const count = await (
        (this as unknown as { constructor: { getRepository?: () => unknown } })
          .constructor as { getRepository?: () => { count: (opts: unknown) => Promise<number> } }
      ).getRepository?.()?.count({ where: { id: Like(`CO-%`) } }) ?? 0;
      const sequence = ((count ?? 0) + 1).toString().padStart(3, "0");
      this.id = `CO-${sequence}`;
    }
}