import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from "typeorm";

@Entity("task_submissions")
export class TaskSubmission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "submission_id", type: "varchar", length: 32 })
  submissionId: string;

  @Index()
  @Column({ name: "ambassador_id", type: "varchar", length: 32, nullable: true })
  ambassadorId: string | null;

  @Column({ name: "task_id", type: "varchar", length: 32, nullable: true })
  taskId: string | null;

  @Column({ name: "submitted_on", type: "varchar", length: 64, nullable: true })
  submittedOn: string;

  @Column({ type: "varchar", length: 512, nullable: true })
  proof: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  task: string;

  @Column({ name: "college", type: "varchar", length: 255, nullable: true })
  college: string;

  @Column({ type: "varchar", length: 32, default: "Pending Review" })
  status: string;

  @Column({ type: "text", nullable: true })
  rejectReason: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
