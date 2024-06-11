import { DataTypes } from "sequelize";

import connectionDatabase from "../configs/database.js";
import Department from "./department.js";
import User from "./user.js";

const TicketAssignee = connectionDatabase.define("TicketAssignee", {
	id: {
		type: DataTypes.CHAR(36),
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
	},
	ApproverId: {
		type: DataTypes.CHAR(36),
		allowNull: true,
		defaultValue: null,
		references: {
			model: User,
		},
	},
	AssigneeId: {
		type: DataTypes.CHAR(36),
		allowNull: true,
		defaultValue: null,
		references: {
			model: User,
		},
	},
	PersonInChargeId: {
		type: DataTypes.CHAR(36),
		allowNull: true,
		defaultValue: null,
		references: {
			model: User,
		},
	},
	ApproverDepartmentId: {
		type: DataTypes.CHAR(36),
		allowNull: false,
		references: {
			model: Department,
		},
	},
	AssigneeDepartmentId: {
		type: DataTypes.CHAR(36),
		allowNull: false,
		references: {
			model: Department,
		},
	},
	status: {
		type: DataTypes.ENUM(
			"Open",
			"Pending",
			"Progress",
			"Complete",
			"Reject",
		),
		allowNull: false,
		defaultValue: "Open",
	},
	assigneeDate: {
		type: DataTypes.DATE,
		allowNull: true,
		defaultValue: null,
	},
	actionTaken: {
		type: DataTypes.STRING,
		allowNull: true,
		defaultValue: null,
	},
	timeTaken: {
		type: DataTypes.STRING,
		allowNull: true,
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

export default TicketAssignee;
