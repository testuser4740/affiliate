import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  OneToMany,
} from "typeorm";
import { Ambassador } from "./ambassadors";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index({ unique: true })
  @Column({ name: "email", type: "varchar", length: 255 })
  email: string;

  @Column({ name: "password_hash", type: "varchar", length: 255 })
  passwordHash: string;

  @Column({ name: "role", type: "varchar", length: 32, default: "ambassador" })
  role: "admin" | "ambassador";

  @Column({ name: "ambassador_id", type: "varchar", length: 32, nullable: true })
  ambassadorId: string | null;

  @Column({ name: "name", type: "varchar", length: 255, nullable: true })
  name: string | null;

  @OneToMany(() => Ambassador, (a) => a.user)
  ambassadors: Ambassador[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
