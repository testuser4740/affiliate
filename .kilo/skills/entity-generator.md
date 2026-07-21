---
name: entity-generator
description: Generate a TypeORM entity with columns, relations, indexes, and constraints following project conventions
---

# Entity Generator

Generate a TypeORM entity for the Gajab Affiliate platform.

## When to use
When adding a new database table / domain concept that needs persistence.

## Rules
- Place the file at `src/entities/<kebab-name>.ts`.
- Use `reflect-metadata` (already imported globally) + `typeorm` decorators.
- Use `@Entity()`, `@PrimaryGeneratedColumn()`, `@Column()`, `@Index()`, `@ManyToOne`/`@OneToMany`/`@ManyToMany` with explicit `() => Entity` lazy relations.
- Set `strictPropertyInitialization: false` is enabled, but still give columns sensible types.
- Define relations to existing entities; never embed business logic.
- Export the entity class from `src/index.ts`.
- Register the entity in `src/data-source.ts` `entities` array.

## Output checklist
- [ ] Entity class with `@Entity`
- [ ] Primary key
- [ ] Columns with types, nullability, defaults
- [ ] Indexes for queried fields
- [ ] Relations with cascade/join options
- [ ] Added to `src/index.ts` and `src/data-source.ts`

## Example skeleton
```ts
import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn } from "typeorm";

@Entity("table_name")
export class Example {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ type: "varchar", length: 255 })
  name!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
```
