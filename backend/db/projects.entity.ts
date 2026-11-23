import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

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
}
