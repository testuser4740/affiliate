import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  Like,
  Index,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Ambassador } from "./ambassadors";

@Entity("affiliate_urls")
export class AffiliateUrl {
  @PrimaryColumn({ name: "id", type: "varchar", length: 32 })
  id: string;

  @Index()
  @Column({ name: "ambassador_id", type: "varchar", length: 32, nullable: true })
  ambassadorId: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  college: string;

  @Column({ type: "varchar", length: 64 })
  label: string;

  @Column({ type: "varchar", length: 512 })
  url: string;

  @Column({ type: "varchar", length: 64, nullable: true })
  campaign: string;

  @Column({ type: "varchar", length: 32 })
  channel: string;

  @Column({ type: "int", default: 0 })
  clicks: number;

  @Column({ type: "int", default: 0 })
  signups: number;

  @Column({ type: "int", default: 0 })
  orders: number;

  @Column({ name: "revenue", type: "decimal", precision: 14, scale: 2, default: 0 })
  revenue: number;

  @Column({ name: "commission", type: "decimal", precision: 14, scale: 2, default: 0 })
  commission: number;

  @Column({ type: "decimal", precision: 5, scale: 2, nullable: true })
  ctr: number;

  @Column({ name: "last_click", type: "timestamp", nullable: true })
  lastClick: Date;

  @Column({ name: "created_on", type: "date", nullable: true })
  createdOn: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @ManyToOne(() => Ambassador, () => Ambassador, { nullable: true })
  @JoinColumn({ name: "ambassador_id" })
  ambassador: Ambassador | null;

  @BeforeInsert()
  async generateId(): Promise<void> {
    if (this.id) return;
    const count = await (
      (this as unknown as { constructor: { getRepository?: () => unknown } })
        .constructor as { getRepository?: () => { count: (opts: unknown) => Promise<number> } }
    ).getRepository?.()?.count({ where: { id: Like(`URL-%`) } });
    const sequence = ((count ?? 0) + 1).toString().padStart(3, "0");
    this.id = `URL-${sequence}`;
  }
}
