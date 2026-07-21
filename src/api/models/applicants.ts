import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  Like,
} from "typeorm";

@Entity("applicants")
export class Applicant {
  @PrimaryColumn({ name: "id", type: "varchar", length: 32 })
  id: string;

  @Column({ name: "applicant_name", type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 32 })
  phone: string;

  @Column({ type: "varchar", length: 32, nullable: true })
  whatsapp: string;

  @Column({ type: "varchar", length: 255 })
  email: string;

  @Column({ type: "varchar", length: 32, nullable: true })
  year: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  instagram: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  linkedin: string;

  @Column({ type: "varchar", length: 128, nullable: true })
  clubInvolvement: string;

  @Column({ type: "varchar", length: 255 })
  college: string;

  @Column({ type: "varchar", length: 128 })
  city: string;

  @Column({ type: "varchar", length: 128 })
  state: string;

  @Column({ name: "commission_pct", type: "int", default: 0 })
  commissionPct: number;

  @Column({ name: "applied_on", type: "date" })
  appliedOn: Date;

  @Column({ type: "varchar", length: 32, default: "Pending" })
  status: string;

  @Column({ type: "boolean", default: false })
  duplicate: boolean;

  @Column({ type: "text", default: "" })
  comments: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @BeforeInsert()
  async generateId(): Promise<void> {
    if (this.id) {
      return;
    }
    const year = new Date().getFullYear();
    const prefix = `AP-${year}-`;
    const count = await (
      (this as unknown as { constructor: { getRepository?: () => unknown } })
        .constructor as { getRepository?: () => { count: (opts: unknown) => Promise<number> } }
    ).getRepository?.()?.count({ where: { id: Like(`${prefix}%`) } });
    const sequence = ((count ?? 0) + 1).toString().padStart(4, "0");
    this.id = `${prefix}${sequence}`;
  }
}
