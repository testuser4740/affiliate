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

@Entity("inbox_messages")
export class InboxMessage {
  @PrimaryColumn({ name: "id", type: "varchar", length: 32 })
  id: string;

  @Index()
  @Column({ name: "ambassador_id", type: "varchar", length: 32, nullable: true })
  ambassadorId: string | null;

  @Column({ type: "varchar", length: 255 })
  from: string;

  @Column({ type: "varchar", length: 255 })
  subject: string;

  @Column({ type: "varchar", length: 512, nullable: true })
  preview: string;

  @Column({ type: "text" })
  body: string;

  @Column({ name: "received_on", type: "varchar", length: 64 })
  receivedOn: string;

  @Column({ type: "boolean", default: false })
  read: boolean;

  @Column({ type: "varchar", length: 32, default: "Normal" })
  priority: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @ManyToOne(() => Ambassador, { nullable: true })
  @JoinColumn({ name: "ambassador_id" })
  ambassador: Ambassador | null;
}
