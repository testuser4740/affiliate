import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Ambassador } from "./ambassadors";
import { OrderUtilizationLog } from "./order-utilization-logs";

@Entity("referral_codes")
export class ReferralCode {
  @PrimaryColumn({ type: "varchar", length: 32 })
  code: string;

  @Column({ type: "varchar", length: 32 })
  type: string;

  @Column({ type: "varchar", length: 16 })
  value: string;

  @Column({ type: "varchar", length: 16, nullable: true })
  cap: string;

  @Column({ type: "int", default: 0 })
  uses: number;

  @Column({ type: "decimal", precision: 14, scale: 2, default: 0 })
  gmv: number;

  @Column({ type: "decimal", precision: 14, scale: 2, default: 0 })
  commission: number;

  @Column({ type: "varchar", length: 32, default: "Active" })
  status: string;

  @Column({ name: "ambassador_id", type: "varchar", length: 32, nullable: true })
  ambassadorId: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @ManyToOne(() => Ambassador, { nullable: true })
  @JoinColumn({ name: "ambassador_id" })
  ambassador: Ambassador | null;

  @OneToMany(() => OrderUtilizationLog, (oul) => oul.referralCode)
  utilizationLogs: OrderUtilizationLog[];
}
