import app from "./app";
import dotenv from "dotenv";
import sequelize from "./config/db";

dotenv.config({ path: "./config.env" });

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected");
    return sequelize.sync(); // optionally { force: true } for dev
  })
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  })
  .catch((err: Error) => console.error("Database connection error:", err));
