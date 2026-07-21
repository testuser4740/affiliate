import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { User } from "./users";
import { Tier } from "./tiers";

export type TierLevel = "Bronze" | "Silver" | "Gold" | "Platinum";

export const TIER_THRESHOLDS = [
  { level: "Platinum" as TierLevel, minRevenue: 150000, commission: 15 },
  { level: "Gold" as TierLevel, minRevenue: 100000, commission: 12 },
  { level: "Silver" as TierLevel, minRevenue: 50000, commission: 10 },
  { level: "Bronze" as TierLevel, minRevenue: 0, commission: 8 },
];

export function resolveTier(revenue: number): { level: TierLevel; commission: number } {
  const matched = TIER_THRESHOLDS.find((t) => revenue >= t.minRevenue);
  return matched ?? TIER_THRESHOLDS[TIER_THRESHOLDS.length - 1];
}

@Entity("ambassadors")
export class Ambassador {
  @PrimaryColumn({ name: "id", type: "varchar", length: 32 })
  id: string;

  @Column({ name: "ambassador_name", type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 255 })
  college: string;

  @Column({ type: "varchar", length: 128 })
  city: string;

  @Column({ type: "varchar", length: 128 })
  state: string;

  @Column({ type: "varchar", length: 255 })
  email: string;

  @Column({ type: "varchar", length: 32 })
  phone: string;

  @Column({ type: "varchar", length: 512, nullable: true })
  avatar: string;

  @Column({ type: "int", default: 0 })
  rank: number;

  @Column({ name: "commission_pct", type: "int", default: 8 })
  commissionPct: number;

  @Column({ name: "revenue", type: "decimal", precision: 14, scale: 2, default: 0 })
  revenue: number;

  @Column({ name: "orders", type: "int", default: 0 })
  orders: number;

  @Index()
  @Column({ name: "user_id", type: "uuid", nullable: true })
  userId: string | null;

  @Index()
  @Column({ name: "tier_id", type: "int", nullable: true })
  tierId: number | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "user_id" })
  user: User | null;

  @ManyToOne(() => Tier, { nullable: true })
  @JoinColumn({ name: "tier_id" })
  tier: Tier | null;
}
