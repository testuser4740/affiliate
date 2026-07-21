import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Ambassador } from "./ambassadors";

@Entity("commission_history")
export class CommissionHistory {
  @PrimaryColumn({ name: "id", type: "varchar", length: 32 })
  id: string;

  @Index()
  @Column({ name: "ambassador_id", type: "varchar", length: 32, nullable: true })
  ambassadorId: string | null;

  @Column({ type: "varchar", length: 64 })
  date: string;

  @Column({ type: "varchar", length: 255 })
  product: string;

  @Column({ type: "varchar", length: 128 })
  category: string;

  @Column({ name: "order_value", type: "decimal", precision: 14, scale: 2, default: 0 })
  orderValue: number;

  @Column({ name: "commission_pct", type: "decimal", precision: 5, scale: 2, default: 0 })
  commissionPct: number;

  @Column({ type: "decimal", precision: 14, scale: 2, default: 0 })
  commission: number;

  @Column({ type: "varchar", length: 32, default: "Placed" })
  status: string;

  @Column({ name: "payout_status", type: "varchar", length: 32, default: "Pending" })
  payoutStatus: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @ManyToOne(() => Ambassador, { nullable: true })
  @JoinColumn({ name: "ambassador_id" })
  ambassador: Ambassador | null;
}
