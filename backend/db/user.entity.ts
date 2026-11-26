import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { unique: true })
  username!: string;

  @Column("varchar", { unique: true, nullable: true })
  email!: string | null;

  @Column("varchar")
  password!: string;
}
