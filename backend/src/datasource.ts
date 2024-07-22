import "dotenv/config";
import { DataSource } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { Url } from "./entities/Url";
import { User } from "./entities/User";

export const dataSourceOptions: PostgresConnectionOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  // Penser à ajouter nos entités ici quand elles seront créées
  entities: [User, Url],
  synchronize: true,
  logging: true,
};

export const dataSource = new DataSource(dataSourceOptions);
