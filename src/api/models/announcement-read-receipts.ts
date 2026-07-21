import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
} from "typeorm";
import { Announcement } from "./announcements";

@Entity("announcement_read_receipts")
export class AnnouncementReadReceipt {
  @PrimaryColumn({ name: "id", type: "varchar", length: 32 })
  id: string;

  @Column({ name: "announcement_id", type: "varchar", length: 32 })
  announcementId: string;

  @Column({ name: "ambassador_id", type: "varchar", length: 32 })
  ambassadorId: string;

  @Column({ name: "read_at", type: "timestamp", nullable: true })
  readAt: Date | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}