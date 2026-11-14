import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { unique: true })
  username!: string;

  
}
