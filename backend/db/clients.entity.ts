import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar",)
  name!: string;

  @Column("varchar",)
  company!: string;

  @Column("varchar",)
  email!: string;

  @Column({ type: "integer", nullable: true, name: "ownerId" })
  userId!: number | null;
}
