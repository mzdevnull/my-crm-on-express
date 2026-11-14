import { DataSource } from "typeorm";
import { User } from "./user.entity";

export const myDataSource = new DataSource({
  type: "better-sqlite3",
  database: "database.sqlite",
  entities: [User],
  logging: true,
  synchronize: true,
});
