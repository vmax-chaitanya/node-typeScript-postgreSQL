import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/db";
import User from "./userModel";
import UserRole from "./userRoleModel";

// Define Role attributes
interface RoleAttributes {
  role_id: number;
  role_name: string;
  createdDate?: Date;
  updatedDate?: Date;
}

// Define creation attributes for Role (omit id for auto-increment)
interface RoleCreationAttributes extends Optional<RoleAttributes, "role_id"> {}

// Create Role model class
class Role
  extends Model<RoleAttributes, RoleCreationAttributes>
  implements RoleAttributes
{
  public role_id!: number;
  public role_name!: string;
  public createdDate!: Date;
  public updatedDate!: Date;
}

Role.init(
  {
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
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
    tableName: "roles",
    timestamps: false,
    hooks: {
      beforeCreate: (role: Role) => {
        const now = new Date();
        role.createdDate = now;
        role.updatedDate = now;
      },
      beforeUpdate: (role: Role) => {
        role.updatedDate = new Date();
      },
    },
  }
);

export default Role;
