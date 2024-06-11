import { DataTypes } from "sequelize";

import connectionDatabase from "../configs/database.js";

const RegistrationNumber = connectionDatabase.define("RegistrationNumber", {
	id: {
		type: DataTypes.CHAR(36),
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
	},
	name: {
		type: DataTypes.STRING(80),
		allowNull: false,
	},
	format: {
		type: DataTypes.STRING(5),
		allowNull: false,
	},
	year: {
		type: DataTypes.INTEGER(4),
		allowNull: false,
	},
	lastNumber: {
		type: DataTypes.INTEGER(3),
		allowNull: false,
		defaultValue: 0,
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

export default RegistrationNumber;
