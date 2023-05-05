import { DataTypes } from "sequelize";
import connectionDatabase from "../configs/database.js";

const TicketOld = connectionDatabase.define("TicketOld", {
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    ticketNo: {
        type: DataTypes.STRING(15),
        allowNull: true,
        defaultValue: null
    },
    location: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null
    },
    description: {
        type: DataTypes.STRING,
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
    }
});

export default TicketOld;