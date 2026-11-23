import { DataSource } from "typeorm";
import { User } from "./user.entity";
import { Client } from "./clients.entity";
import { Projects } from "./projects.entity";
export const myDataSource = new DataSource({
  type: "better-sqlite3",
  database: "database.sqlite",
  entities: [User, Client, Projects],
  logging: true,
  synchronize: true,
});
