import { DataTypes } from "sequelize";
import connectionDatabase from "../configs/database.js";

const TicketOld = connectionDatabase.define("TicketOld", {
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    woNo: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: null
    },
    ticketNo: {
        type: DataTypes.STRING(30),
        allowNull: true,
        defaultValue: null
    },
    location: {
        type: DataTypes.STRING(150),
        allowNull: true,
        defaultValue: null
    },
    description: {
        type: DataTypes.STRING(300),
        allowNull: false,
    },
    remark: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null
    },
    receivedDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null
    },
    completedDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: null
    },
    ticketType: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    ticketStatus: {
        type: DataTypes.ENUM("OPEN", "COMPLETE"),
        defaultValue: "OPEN",
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

export default TicketOld;