import express, { Router } from "express";
import {
  allUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import {
  signup,
  login,
  protect,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../controllers/authController";

const routes: Router = express.Router();

routes.route("/signup").post(signup);
routes.route("/login").post(login);

routes.post("/forgot-password", forgotPassword);
routes.post("/verify-otp", verifyOtp);
routes.post("/reset-password", resetPassword);

routes.route("/").get(protect, allUsers);
routes
  .route("/:id")
  .get(protect, getUser)
  .patch(protect, updateUser)
  .delete(protect, deleteUser);

export default routes;
