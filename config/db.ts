import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    logging: false,
  }
);

export default sequelize;
