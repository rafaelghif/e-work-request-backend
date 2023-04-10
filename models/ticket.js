import { DataTypes } from "sequelize";
import connectionDatabase from "../configs/database.js";
import Department from "./department.js";
import Line from "./line.js";
import User from "./user.js";

const Ticket = connectionDatabase.define("Ticket", {
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    ticketNumber: {
        type: DataTypes.STRING(11),
        unique: true,
        allowNull: false
    },
    workNumber: {
        type: DataTypes.STRING(10),
        allowNull: true,
        defaultValue: null,
    },
    title: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(80),
        allowNull: false
    },
    jigToolNo: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    qty: {
        type: DataTypes.INTEGER(2),
        allowNull: false,
    },
    expectDueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    RequesterId: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {
            model: User
        }
    },
    ReceiverId: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        defaultValue: null,
        references: {
            model: User
        }
    },
    RequesterDepartmentId: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {
            model: Department
        }
    },
    RequesterLineId: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        references: {
            model: Line
        },
        defaultValue: null
    },
    ReceiverDepartmentId: {
        type: DataTypes.CHAR(36),
        allowNull: true,
        references: {
            model: Department
        },
        defaultValue: null
    },
    ticketStatus: {
        type: DataTypes.ENUM("Request", "Progress", "Send to the Requestor", "Complete", "Reject"),
        allowNull: false,
        defaultValue: "Request"
    },
    sendToRequestorDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    },
    completeDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
    },
    inActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    createdBy: {
        type: DataTypes.STRING(8),
        allowNull: false,
        validate: {
            min: 8
        }
    },
    updatedBy: {
        type: DataTypes.STRING(8),
        allowNull: false,
        validate: {
            min: 8
        }
    }
});

export default Ticket;