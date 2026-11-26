import { Entity, Column, PrimaryGeneratedColumn,ManyToOne } from "typeorm";
import { Client } from './clients.entity';
export type TaskStatus = "In progress" | "Planning" | "Review" | "Completed";

@Entity()
export class Projects {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  title!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({
    type: "varchar",
    default: "Planning",
  })
  status!: TaskStatus;

  @Column({ type: "varchar" })
  due!: string;

  @Column({ type: "integer", default: 0 })
  progress!: number;

  @ManyToOne(() => Client, { onDelete: 'CASCADE' })
  client!: Client;

  @Column({ type: "integer", nullable: true, name: "ownerId" })
  userId!: number | null;
}
