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

@Entity("payouts")
export class Payout {
  @PrimaryColumn({ name: "id", type: "varchar", length: 32 })
  id: string;

  @Index()
  @Column({ name: "ambassador_id", type: "varchar", length: 32, nullable: true })
  ambassadorId: string | null;

  @Column({ type: "varchar", length: 64 })
  period: string;

  @Column({ type: "varchar", length: 16 })
  month: string;

  @Column({ type: "decimal", precision: 14, scale: 2, default: 0 })
  amount: number;

  @Column({ type: "varchar", length: 32, default: "Processing" })
  status: string;

  @Column({ type: "varchar", length: 64, nullable: true })
  date: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @ManyToOne(() => Ambassador, { nullable: true })
  @JoinColumn({ name: "ambassador_id" })
  ambassador: Ambassador | null;
}
