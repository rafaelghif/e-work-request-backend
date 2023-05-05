import { errorLogging } from "../helpers/error.js";
import models from "../models/index.js";
import * as XLSX from "xlsx/xlsx.mjs";
import * as fs from "fs";
import path from "path";
import * as fns from "date-fns";
import connectionDatabase from "../configs/database.js";
import { Op } from "sequelize";

export const formatDate = (stringDate, cols) => {
    try {
        return fns.format(Date.parse(stringDate), "yyyy-MM-dd", { timeZone: "Asia/Jakarta" });
    } catch (err) {
        console.log(cols);
    }
}

export const getTickets = async (req, res) => {
    try {
        const { search } = req.query;

        const { year, month, type } = req.params;
        const currentDate = new Date();

        let where = {}

        if (search) {
            where = {
                [Op.or]: [{
                    ticketNo: { [Op.like]: `%${search}%` }
                }, {
                    location: { [Op.like]: `%${search}%` }
                }, {
                    description: { [Op.like]: `%${search}%` }
                }, {
                    remark: { [Op.like]: `%${search}%` }
                }]
            }
        }

        if (type !== "All") {
            where = {
                ...where,
                [Op.or]: [...where[Op.or], { ticketType: type }]
            }
        }

        const yearFilter = parseInt(year) || currentDate.getFullYear();
        const monthFilter = parseInt(month) || currentDate.getMonth() + 1;

        if (year !== "All") {
            where = {
                ...where,
                [Op.and]: [connectionDatabase.where(connectionDatabase.fn("YEAR", connectionDatabase.col("TicketOld.receivedDate")), yearFilter)]
            }
        }

        if (month !== "All") {
            where = {
                ...where,
                [Op.and]: [...where[Op.and], connectionDatabase.where(connectionDatabase.fn("MONTH", connectionDatabase.col("TicketOld.receivedDate")), monthFilter)]
            }
        }

        const response = await models.TicketOld.findAll({
            order: [["receivedDate", "ASC"]],
            where
        });

        return res.status(200).json({
            message: "Success Fetch Ticket Old!",
            data: response
        });
    } catch (err) {
        errorLogging(err.toString());
        return res.status(400).json({
            isExpressValidation: false,
            data: {
                title: "Something Wrong!",
                message: err.toString()
            }
        });
    }
}

export const importTicket = async (req, res) => {
    try {
        const ticketType = "FJ";
        const fileName = "WO-FJ Fabrication of Jig (New Jig) (form go to Tooling).xlsx";
        const directoryPath = "D:/40703191/Programming/NodeJS/Personal/e-work-request/e-work-request-backend/public/ticket/old";

        XLSX.set_fs(fs);

        const filePath = path.join(directoryPath, fileName);
        const file = XLSX.readFile(filePath, { cellDates: true });

        const sheets = file.SheetNames;

        const promises = sheets.map(async (sheet) => {
            const rows = XLSX.utils.sheet_to_json(file.Sheets[sheet]);
            for (const cols of rows) {
                if (cols["Description Of Problem"]) {
                    if (cols["Description Of Problem"] === "") {
                        break;
                    }

                    if (cols["Description Of Problem"] && typeof cols["Location"] === "undefined") {
                        continue;
                    }

                    const workOrderNo = cols["No."] ? cols["No."].trim() : "";
                    const location = cols["Location"].trim();
                    const description = cols["Description Of Problem"].trim();
                    const receivedDate = cols["Received"] ? formatDate(cols["Received"], cols) : null;
                    const completedDate = cols["Completed"] ? formatDate(cols["Completed"], cols) : null;
                    const remark = cols["Remarks"] ? cols["Remarks"].trim() : null;

                    await models.TicketOld.create({
                        ticketNo: workOrderNo,
                        location,
                        description,
                        remark,
                        receivedDate,
                        completedDate,
                        ticketType
                    }, { logging: false });
                }
            }
        });

        await Promise.all(promises);

        return res.status(200).json({
            message: "Success Import!",
            data: null
        });
    } catch (err) {
        errorLogging(err.toString());
        return res.status(400).json({
            isExpressValidation: false,
            data: {
                title: "Something Wrong!",
                message: err.toString()
            }
        });
    }
}