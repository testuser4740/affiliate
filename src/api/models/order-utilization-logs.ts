import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Ambassador } from "./ambassadors";
import { ReferralCode } from "./referral-codes";

@Entity("order_utilization_logs")
export class OrderUtilizationLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "order_id", type: "varchar", length: 32 })
  orderId: string;

  @Column({ name: "customer_id", type: "varchar", length: 32 })
  customerId: string;

  @Index()
  @Column({ name: "ambassador_id", type: "varchar", length: 32, nullable: true })
  ambassadorId: string | null;

  @Column({ name: "referral_code_id", type: "varchar", length: 32, nullable: true })
  referralCodeId: string | null;

  @Column({ name: "order_value", type: "decimal", precision: 14, scale: 2, default: 0 })
  orderValue: number;

  @Column({ name: "used_at", type: "timestamp" })
  usedAt: Date;

  @Column({ type: "decimal", precision: 14, scale: 2, default: 0 })
  discount: number;

  @Column({ name: "commission_pct", type: "decimal", precision: 5, scale: 2, default: 0 })
  commissionPct: number;

  @Column({ name: "commission_value", type: "decimal", precision: 14, scale: 2, default: 0 })
  commissionValue: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @ManyToOne(() => Ambassador, { nullable: true })
  @JoinColumn({ name: "ambassador_id" })
  ambassador: Ambassador | null;

  @ManyToOne(() => ReferralCode, (rc) => rc.utilizationLogs, { nullable: true })
  @JoinColumn({ name: "referral_code_id" })
  referralCode: ReferralCode | null;
}
