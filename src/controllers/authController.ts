import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
import jwt, { SignOptions } from "jsonwebtoken";

import bcrypt from "bcryptjs";
import User from "./../models/userModel";
import sendEmail from "./../../utils/email";

// Type for JWT payload
interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

// Signup
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.create(req.body);
    res.status(200).json({ status: "success", data: user });
  } catch (err: any) {
    res.status(500).json({ status: "error", message: err.errors });
  }
};

// JWT Token generator
const signToken = (id: string): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRE;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const options: SignOptions = {
    expiresIn: 90000,
  };

  return jwt.sign({ id }, secret, options);
};
// Login
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      status: "fail",
      message: "Please provide email and password",
    });
    return;
  }

  try {
    const user = await User.findOne({
      where: { email },
      attributes: ["user_id", "firstName", "email", "password"],
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
      return;
    }

    // const token = signToken(user.user_id);
    const token = signToken(user.user_id.toString());

    res.status(200).json({
      status: "success",
      token,
      data: {
        id: user.user_id,
        name: user.firstName,
        email: user.email,
      },
    });
  } catch (err: any) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Middleware: Protect routes
export const protect = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401).json({
      status: "fail",
      message: "You are not logged in. Please log in to get access.",
    });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    const currentUser = await User.findByPk(decoded.id);
    if (!currentUser) {
      res.status(401).json({
        status: "fail",
        message: "The user belonging to this token no longer exists.",
      });
      return;
    }

    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: "Invalid or expired token",
    });
  }
};

// Helper: Generate 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Forgot Password (Send OTP)
export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({
        status: "fail",
        message: "Please provide a valid email address",
      });
      return;
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({
        status: "fail",
        message: "There is no user with that email address",
      });
      return;
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // user.passwordResetOtp = otp;
    user.passwordResetOtp = Number(otp);

    user.passwordResetOtpExpires = otpExpiry;
    await user.save();

    await sendEmail({
      email: user.email,
      subject: "Your password reset OTP (valid for 10 min)",
      text: `Your OTP for password reset is: ${otp}`,
      html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p>`,
    });

    res.status(200).json({ status: "success", message: "OTP sent to email!" });
  } catch (err: any) {
    res.status(500).json({ status: "error", message: ` err : ${err.message}` });
  }
};

// Verify OTP
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(404).json({ status: "fail", message: "User not found" });
      return;
    }

    if (user.passwordResetOtp !== otp.toString()) {
      res.status(400).json({ status: "fail", message: "Invalid OTP" });
      return;
    }

    const expiryDate = user.passwordResetOtpExpires
      ? new Date(user.passwordResetOtpExpires)
      : undefined;
    const now = new Date();

    if (expiryDate && expiryDate < now) {
      res.status(400).json({ status: "fail", message: "OTP has expired" });
      return;
    }

    res
      .status(200)
      .json({ status: "success", message: "OTP verified successfully" });
  } catch (err: any) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Reset Password
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(404).json({ status: "fail", message: "User not found" });
      return;
    }

    if (
      !newPassword ||
      newPassword.length < 8 ||
      newPassword !== confirmPassword
    ) {
      res.status(400).json({
        status: "fail",
        message: "Passwords must match and be at least 8 characters long",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.passwordResetOtp = null;
    user.passwordResetOtpExpires = null;
    await user.save();

    await sendEmail({
      email: user.email,
      subject: "Password reset successful",
      text: "Your password has been successfully reset.",
      html: "<h1>Your password has been successfully reset.</h1>",
    });

    res.status(200).json({
      status: "success",
      message: "Password updated successfully",
    });
  } catch (err: any) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
