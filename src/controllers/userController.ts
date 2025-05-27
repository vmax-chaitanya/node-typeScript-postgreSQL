import { Request, Response, NextFunction } from "express";
import User from "./../models/userModel";
// import Role from "./../models/roleModel";
// import UserRole from "./../models/userRoleModel";

// Get all users
export const allUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.findAll();
    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Get single user by ID
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({
        status: "error",
        message: `User not found for ${id}`,
      });
      return;
    }

    res.status(200).json({
      message: "success",
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Update user
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({
        status: "error",
        message: `User not found for ${id}`,
      });
      return;
    }

    await User.update(req.body, {
      where: { user_id: id },
    });

    res.status(200).json({
      message: "success updated",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

// Delete user
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id;
    await User.destroy({ where: { user_id: id } });

    res.status(204).json({
      message: "success deleted",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
