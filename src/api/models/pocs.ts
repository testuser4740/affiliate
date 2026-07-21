import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  Like,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Ambassador } from "./ambassadors";

@Entity("pocs")
export class Poc {
  @PrimaryColumn({ name: "id", type: "varchar", length: 32 })
  id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 128 })
  role: string;

  @Column({ type: "varchar", length: 255 })
  region: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  email: string;

  @Column({ type: "varchar", length: 32, nullable: true })
  phone: string;

  @Column({ type: "varchar", length: 32, nullable: true })
  whatsapp: string;

  @Column({ type: "varchar", length: 512, nullable: true })
  avatar: string;

  @Column({ name: "working_hours", type: "varchar", length: 128, nullable: true })
  workingHours: string;

  @ManyToMany(() => Ambassador, { nullable: true })
  @JoinTable({ name: "poc_linked_affiliates" })
  ambassadors: Ambassador[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @BeforeInsert()
  async generateId(): Promise<void> {
    if (this.id) return;
    const count = await (
      (this as unknown as { constructor: { getRepository?: () => unknown } })
        .constructor as { getRepository?: () => { count: (opts: unknown) => Promise<number> } }
    ).getRepository?.()?.count({ where: { id: Like(`POC-%`) } });
    const sequence = ((count ?? 0) + 1).toString().padStart(3, "0");
    this.id = `POC-${sequence}`;
  }
}
