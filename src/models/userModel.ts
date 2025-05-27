import { DataTypes, Model, Optional } from "sequelize";
import bcrypt from "bcryptjs";
import sequelize from "./../../config/db";
import Role from "./roleModel";
import UserRole from "./userRoleModel";

// Define User attributes
interface UserAttributes {
  user_id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  otp?: number | null;
  passwordResetOtp?: number | null;
  passwordResetOtpExpires?: Date | null;
  createdDate?: Date;
  updatedDate?: Date;
}

// Define attributes used on creation (exclude auto-generated user_id)
interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    | "user_id"
    | "otp"
    | "passwordResetOtp"
    | "passwordResetOtpExpires"
    | "createdDate"
    | "updatedDate"
  > {}

// User model class
class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public user_id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public password!: string;
  public otp!: number | null;
  public passwordResetOtp!: number | null;
  public passwordResetOtpExpires!: Date | null;
  public createdDate!: Date;
  public updatedDate!: Date;

  // Add any instance methods here if needed in future
}

User.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    passwordResetOtp: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    passwordResetOtpExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdDate: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    updatedDate: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: false,
    defaultScope: {
      attributes: { exclude: ["password", "otp"] },
    },
    hooks: {
      beforeCreate: async (user: User) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user.otp = Math.floor(100000 + Math.random() * 900000);
        const now = new Date();
        user.createdDate = now;
        user.updatedDate = now;
      },
      beforeUpdate: async (user: User) => {
        user.updatedDate = new Date();
      },
    },
  }
);

// Setup Many-to-Many relation between User and Role through UserRole
User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: "user_id",
  otherKey: "role_id",
});

export default User;
