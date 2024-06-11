import { DataTypes } from "sequelize";

import connectionDatabase from "../configs/database.js";

const Department = connectionDatabase.define("Department", {
	id: {
		type: DataTypes.CHAR(36),
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
	},
	name: {
		type: DataTypes.STRING(80),
		allowNull: false,
	},
	abbreviation: {
		type: DataTypes.STRING(20),
		allowNull: false,
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

export default Department;
