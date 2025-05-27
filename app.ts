import express, { Application } from "express";
import dotenv from "dotenv";

import rateLimit from "express-rate-limit";
import helmet from "helmet";

import userRouter from "./src/routes/userRoutes";
// import blogRouter from "./routes/blogRoutes";
import roleRouter from "./src/routes/roleRoutes";

dotenv.config({ path: "./config.env" });

const app: Application = express();
app.use(helmet());
app.use(express.json());

const limiter = rateLimit({
  max: 5,
  windowMs: 60 * 60 * 1000,
  message: "Too may attempts from this IP, Ratelimiter blocks your IP ",
});

app.use("/api", limiter);
app.use("/api/v1/users", userRouter);
// app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/roles", roleRouter);

// Uncomment below if you implement AppError and globalErrorHandler
// import AppError from "./utils/appError";
// import globalErrorHandler from "./controllers/errorController";

// app.all("*", (req, res, next) => {
//   next(new AppError(`Can't find the requested URL (${req.originalUrl})`, 404));
// });

// app.use(globalErrorHandler);

export default app;
