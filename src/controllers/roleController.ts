import { Request, Response } from "express";
import User from "./../models/userModel";
import Role from "./../models/roleModel";
import UserRole from "./../models/userRoleModel";

// Create role
export const createRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { role_name } = req.body;
    const role = await Role.create({ role_name });

    res.status(201).json({
      status: "success",
      message: "Role created successfully",
      data: { role },
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Get all roles
export const getAllRoles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const roles = await Role.findAll();
    res.status(200).json({
      status: "success",
      message: "Roles retrieved successfully",
      roles,
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Get role by ID
export const getRoleById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) {
      res.status(404).json({
        status: "error",
        message: "Role not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Role retrieved successfully",
      data: { role },
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Update role
export const updateRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const role = await Role.findByPk(id);
    if (!role) {
      res.status(404).json({
        status: "error",
        message: "Role not found",
      });
      return;
    }

    await role.update({ role_name: req.body.role_name });

    res.status(200).json({
      status: "success",
      message: "Role updated successfully",
      data: { role },
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.errors });
  }
};

// Delete role
export const deleteRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) {
      res.status(404).json({
        status: "error",
        message: "Role not found",
      });
      return;
    }

    await role.destroy();

    res.status(204).json({
      status: "success",
      message: "Role deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Assign role to user
export const assignRoleToUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user_id, role_id } = req.body;

    const user = await User.findByPk(user_id);
    const role = await Role.findByPk(role_id);

    if (!user || !role) {
      res.status(404).json({
        status: "error",
        message: "User or Role not found",
      });
      return;
    }

    const existing = await UserRole.findOne({ where: { user_id, role_id } });
    if (existing) {
      res.status(400).json({
        status: "error",
        message: "Role already assigned to this user",
      });
      return;
    }

    const userRole = await UserRole.create({ user_id, role_id });

    res.status(200).json({
      status: "success",
      message: "Role assigned to user successfully",
      data: { userRole },
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Get users with roles
export const getUsersWithRoles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Role,
          through: { attributes: [] },
          attributes: ["role_id", "role_name"],
        },
      ],
      attributes: {
        exclude: [
          "password",
          "otp",
          "passwordResetOtp",
          "passwordResetOtpExpires",
        ],
      },
    });

    res.status(200).json({
      status: "success",
      message: "Users with roles fetched successfully",
      data: { users },
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
