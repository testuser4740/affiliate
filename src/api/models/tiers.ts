import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Ambassador } from "./ambassadors";

@Entity("tiers")
export class Tier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 64 })
  name: string;

  @Column({ name: "min_revenue", type: "decimal", precision: 14, scale: 2, default: 0 })
  min: number;

  @Column({ name: "max_revenue", type: "decimal", precision: 14, scale: 2, default: 0 })
  max: number;

  @Column({ type: "varchar", length: 32, nullable: true })
  color: string;

  @Column({ type: "varchar", length: 16, nullable: true })
  icon: string;

  @Column({ type: "varchar", length: 16 })
  commission: string;

  @Column({ type: "simple-array", nullable: true })
  perks: string[];

  @OneToMany(() => Ambassador, (a) => a.tier)
  ambassadors: Ambassador[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
