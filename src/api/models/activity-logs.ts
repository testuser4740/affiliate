import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("activity_logs")
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "date" })
  date: Date;

  @Column({ type: "int", default: 0 })
  clicks: number;

  @Column({ type: "int", default: 0 })
  signups: number;

  @Column({ type: "int", default: 0 })
  orders: number;

  @Column({ type: "decimal", precision: 14, scale: 2, default: 0 })
  revenue: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
