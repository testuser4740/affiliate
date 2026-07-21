import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  OneToMany,
  Like,
} from "typeorm";
import { TaskSubmission } from "./task-submissions";

@Entity("tasks")
export class Task {
  @PrimaryColumn({ name: "id", type: "varchar", length: 32 })
  id: string;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "date", nullable: true })
  deadline: Date;

  @Column({ type: "int", default: 0 })
  reward: number;

  @Column({ name: "assigned_count", type: "int", default: 0 })
  assignedCount: number;

  @Column({ name: "completed_count", type: "int", default: 0 })
  completedCount: number;

  @Column({ type: "varchar", length: 32, default: "Active" })
  status: string;

  @OneToMany(() => TaskSubmission, (ts) => ts.task)
  submissions: TaskSubmission[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @BeforeInsert()
  async generateId(): Promise<void> {
    if (this.id) return;
    const count = await (
      (this as unknown as { constructor: { getRepository?: () => unknown } })
        .constructor as { getRepository?: () => { count: (opts: unknown) => Promise<number> } }
    ).getRepository?.()?.count({ where: { id: Like(`T-%`) } });
    const sequence = ((count ?? 0) + 1).toString().padStart(3, "0");
    this.id = `T-${sequence}`;
  }
}
