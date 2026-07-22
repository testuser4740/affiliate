import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  Like,
} from "typeorm";

@Entity("announcements")
export class Announcement {
  @PrimaryColumn({ name: "id", type: "varchar", length: 32 })
  id: string;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "text" })
  body: string;

  @Column({ type: "varchar", length: 64 })
  audience: string;

  @Column({ type: "varchar", length: 64, nullable: true })
  tier: string | null;

  @Column({ type: "varchar", length: 64, nullable: true })
  city: string | null;

  @Column({ type: "varchar", length: 64, nullable: true })
  state: string | null;

  @Column({ name: "sent_on", type: "timestamp", nullable: true })
  sentOn: Date;

  @Column({ type: "int", default: 0 })
  reads: number;

  @Column({ type: "int", default: 0 })
  total: number;

  @Column({ type: "varchar", length: 32, default: "Medium" })
  priority: string;

  @Column({ name: "send_to_ambassadors", type: "boolean", default: false })
  sendToAmbassadors: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @BeforeInsert()
  async generateId(): Promise<void> {
    if (this.id) {
      return;
    }
    const ts = Date.now().toString(36);
    const rand = Math.floor(Math.random() * 36).toString(36);
    this.id = `ANN-${ts}${rand}`.slice(0, 32);
  }
}
