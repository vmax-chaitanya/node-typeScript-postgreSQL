import express, { Router, Request, Response, NextFunction } from "express";
import {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
  assignRoleToUser,
  getUsersWithRoles,
} from "../controllers/roleController";
import { protect } from "../controllers/authController";

const routes: Router = express.Router();

routes.get("/getUsersWithRoles", protect, getUsersWithRoles);

routes.post("/", protect, createRole);
routes.get("/", protect, getAllRoles);
routes.get("/:id", protect, getRoleById);
routes.patch("/:id", protect, updateRole);
routes.delete("/:id", protect, deleteRole);

routes.post("/assign", protect, assignRoleToUser);

export default routes;
