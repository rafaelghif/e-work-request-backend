import { DataTypes } from "sequelize";

import connectionDatabase from "../configs/database.js";

const LedgerJigDetailHistory = connectionDatabase.define(
	"LedgerJigDetailHistory",
	{
		id: {
			type: DataTypes.CHAR(36),
			primaryKey: true,
			defaultValue: DataTypes.UUIDV4,
		},
		regNo: {
			type: DataTypes.STRING(30),
			allowNull: false,
		},
		approveBy: {
			type: DataTypes.STRING(70),
			allowNull: false,
		},
		checkedBy: {
			type: DataTypes.STRING(70),
			allowNull: false,
		},
		makeBy: {
			type: DataTypes.STRING(70),
			allowNull: false,
		},
		registrationDate: {
			type: DataTypes.DATEONLY,
			allowNull: false,
		},
		machineUse: {
			type: DataTypes.STRING(50),
			allowNull: true,
			defaultValue: null,
			set(val) {
				this.setDataValue("machineUse", val || null);
			},
		},
		partNo: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		partName: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		acquiredDate: {
			type: DataTypes.DATEONLY,
			allowNull: false,
		},
		location: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		fileName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		remark: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: null,
			set(val) {
				this.setDataValue("remark", val || null);
			},
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
	},
);

export default LedgerJigDetailHistory;
