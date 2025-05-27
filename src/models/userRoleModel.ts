import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/db";

// Define attributes for UserRole
interface UserRoleAttributes {
  id: number;
  user_id: number;
  role_id: number;
  createdDate?: Date;
  updatedDate?: Date;
}

// Attributes for creation (id is auto incremented)
interface UserRoleCreationAttributes
  extends Optional<UserRoleAttributes, "id" | "createdDate" | "updatedDate"> {}

class UserRole
  extends Model<UserRoleAttributes, UserRoleCreationAttributes>
  implements UserRoleAttributes
{
  public id!: number;
  public user_id!: number;
  public role_id!: number;
  public createdDate!: Date;
  public updatedDate!: Date;
}

UserRole.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "roles",
        key: "role_id",
      },
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
    tableName: "user_roles",
    timestamps: false,
    hooks: {
      beforeCreate: (userRole: UserRole) => {
        const now = new Date();
        userRole.createdDate = now;
        userRole.updatedDate = now;
      },
      beforeUpdate: (userRole: UserRole) => {
        userRole.updatedDate = new Date();
      },
    },
  }
);

export default UserRole;
