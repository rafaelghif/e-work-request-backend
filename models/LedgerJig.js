import { DataTypes } from "sequelize";

import connectionDatabase from "../configs/database.js";

const LedgerJig = connectionDatabase.define("LedgerJig", {
	id: {
		type: DataTypes.CHAR(36),
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
	},
	regNo: {
		type: DataTypes.STRING(15),
		allowNull: false,
		unique: true,
	},
	sequence: {
		type: DataTypes.INTEGER,
		allowNull: false,
		unique: true,
	},
	name: {
		type: DataTypes.STRING(100),
		allowNull: false,
	},
	maker: {
		type: DataTypes.STRING(30),
		allowNull: false,
	},
	location: {
		type: DataTypes.STRING(100),
		allowNull: false,
	},
	qty: {
		type: DataTypes.INTEGER,
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
	status: {
		type: DataTypes.ENUM("Operation", "Superseded"),
		defaultValue: "Operation",
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

export default LedgerJig;
