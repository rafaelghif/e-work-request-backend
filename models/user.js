import bcrypt from "bcrypt";
import { DataTypes } from "sequelize";

import connectionDatabase from "../configs/database.js";

const User = connectionDatabase.define("User", {
	id: {
		type: DataTypes.CHAR(36),
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
	},
	badgeId: {
		type: DataTypes.STRING(8),
		allowNull: false,
		validate: {
			min: 8,
		},
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
		set(val) {
			this.setDataValue("password", bcrypt.hashSync(val, 10));
		},
	},
	name: {
		type: DataTypes.STRING(90),
		allowNull: false,
	},
	email: {
		type: DataTypes.STRING(150),
		allowNull: true,
		defaultValue: null,
		validate: {
			isEmail: true,
		},
	},
	role: {
		type: DataTypes.ENUM("SUPER USER", "ADMIN", "BASIC"),
		allowNull: false,
		defaultValue: "BASIC",
	},
	inActive: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
	},
	createdBy: {
		type: DataTypes.STRING(8),
		allowNull: false,
		validate: {
			min: 8,
		},
	},
	updatedBy: {
		type: DataTypes.STRING(8),
		allowNull: false,
		validate: {
			min: 8,
		},
	},
});

export default User;
