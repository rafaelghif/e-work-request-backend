import { validationResult } from "express-validator/src/validation-result.js";
import { Op, QueryTypes } from "sequelize";
import connectionDatabase from "../configs/database.js";
import { errorLogging } from "../helpers/error.js";
import { transporter } from "../libs/node-mailer.js";
import models from "../models/index.js";
import { mkdir } from "fs/promises";
import { copyFile, unlink } from "fs";

const generateTicketNumber = (data) => {
    const { ticketNumber } = data;
    const currentDate = new Date();

    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const currentYear = currentDate.getFullYear().toString().substring(2, 4);

    const ticketYear = ticketNumber.substr(3, 2);
    const ticketMonth = ticketNumber.substr(5, 2);

    let newTicketNumber = null;

    if (currentYear === ticketYear && currentMonth === ticketMonth) {
        const ticketNumberParts = ticketNumber.split("-");
        const ticketNumberSequence = parseInt(ticketNumberParts[2]);
        const newTicketNumberSequence = (ticketNumberSequence + 1).toString().padStart(3, "0");
        newTicketNumber = `WR-${currentYear}${currentMonth}-${newTicketNumberSequence}`;
    } else {
        newTicketNumber = `WR-${currentYear}${currentMonth}-001`;
    }
    return newTicketNumber;
}

export const getTicketNumber = async (req, res) => {
    try {
        const { search } = req.query;
        let where = {
            inActive: false
        }

        if (search) {
            where = {
                ...where,
                ticketNumber: { [Op.like]: `%${search}%` }
            }
        }

        const response = await models.Ticket.findAll({
            attributes: ["id", "ticketNumber", "description", "jigToolNo", "qty", "expectDueDate", "attachmentFile"],
            order: [["ticketNumber", "ASC"]],
            where
        });

        return res.status(200).json({
            message: "Success Fetch Ticket Number!",
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

export const getWorkRequest = async (req, res) => {
    try {
        const { search } = req.query;

        const { user, department, section } = req.decoded;
        const responseSection = await connectionDatabase.query(`SELECT DISTINCT level FROM sections WHERE DepartmentId = '${department.id}' ORDER BY level ASC`, { type: QueryTypes.SELECT });
        const userLevelDb = responseSection.map((data) => parseInt(data.level));

        const accept = [
            { level: [0, 1, 2], userLevel: 0, status: ["Approve", "Progress", "Pending"] },
            { level: [0, 1, 2], userLevel: 1, status: ["Approve", "Progress", "Pending"] },
            { level: [0, 1, 2], userLevel: 2, status: ["Pending", "Progress"] },
            { level: [0, 1], userLevel: 0, status: ["Approve", "Progress", "Pending"] },
            { level: [0, 1], userLevel: 1, status: ["Pending", "Progress"] }
        ];

        const userAccept = accept.find(({ level, userLevel }) => level.every((value, index) => value === userLevelDb[index]) && userLevel === parseInt(section.level));
        const { status: userAcceptStatus = [] } = userAccept || {};

        let where = {
            ticketStatus: {
                [Op.in]: userAcceptStatus
            },
            inActive: false
        }

        if (search) {
            where = {
                ...where,
                [Op.or]: [{
                    ticketNumber: { [Op.like]: `%${search}%` }
                }, {
                    workNumber: { [Op.like]: `%${search}%` }
                }, {
                    title: { [Op.like]: `%${search}%` }
                }, {
                    jigToolNo: { [Op.like]: `%${search}%` }
                }]
            }
        }

        let whereTicketAssign = {
            AssigneeDepartmentId: department.id,
            inActive: false,
            status: {
                [Op.ne]: "Complete"
            }
        }

        if (userLevelDb.length === 2) {
            if (parseInt(section.level) !== 0) {
                whereTicketAssign = {
                    ...whereTicketAssign,
                    PersonInChargeId: user.id
                };
            }
        } else if (userLevelDb.length === 3) {
            if (parseInt(section.level) === 2) {
                whereTicketAssign = {
                    ...whereTicketAssign,
                    PersonInChargeId: user.id
                };
            }
        }

        const response = await models.Ticket.findAll({
            order: [
                ["expectDueDate", "ASC"]
            ],
            where,
            include: [{
                model: models.RegistrationNumber,
                attributes: ["id", "name", "format", "lastNumber"]
            }, {
                model: models.User,
                attributes: ["id", "badgeId", "name"],
                as: "Requester"
            }, {
                model: models.User,
                attributes: ["id", "badgeId", "name"],
                as: "Receiver"
            }, {
                model: models.Department,
                attributes: ["id", "name"],
                as: "RequesterDepartment"
            }, {
                model: models.Department,
                attributes: ["id", "name"],
                as: "ReceiverDepartment"
            }, {
                model: models.Line,
                attributes: ["id", "name"],
                as: "RequesterLine"
            }, {
                model: models.TicketAssignee,
                where: whereTicketAssign,
                include: [{
                    model: models.User,
                    attributes: ["id", "badgeId", "name"],
                    as: "Approver"
                }, {
                    model: models.User,
                    attributes: ["id", "badgeId", "name"],
                    as: "Assignee"
                }, {
                    model: models.User,
                    attributes: ["id", "badgeId", "name"],
                    as: "PersonInCharge"
                }, {
                    model: models.Department,
                    attributes: ["id", "name"],
                    as: "ApproverDepartment"
                }, {
                    model: models.Department,
                    attributes: ["id", "name"],
                    as: "AssigneeDepartment"
                }]
            }]
        });

        return res.status(200).json({
            message: "Success Fetch Work Requests!",
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

export const getWorkRequestCount = async (req, res) => {
    try {
        const { user, department, section } = req.decoded;
        const responseSection = await connectionDatabase.query(`SELECT DISTINCT level FROM sections WHERE DepartmentId = '${department.id}' ORDER BY level ASC`, { type: QueryTypes.SELECT });
        const userLevelDb = responseSection.map((data) => parseInt(data.level));

        const accept = [
            { level: [0, 1, 2], userLevel: 0, status: ["Approve", "Progress", "Pending"] },
            { level: [0, 1, 2], userLevel: 1, status: ["Approve", "Progress", "Pending"] },
            { level: [0, 1, 2], userLevel: 2, status: ["Pending", "Progress"] },
            { level: [0, 1], userLevel: 0, status: ["Approve", "Progress", "Pending"] },
            { level: [0, 1], userLevel: 1, status: ["Pending", "Progress"] }
        ];

        const userAccept = accept.find(({ level, userLevel }) => level.every((value, index) => value === userLevelDb[index]) && userLevel === parseInt(section.level));
        const { status: userAcceptStatus = [] } = userAccept || {};

        let where = {
            ticketStatus: {
                [Op.in]: userAcceptStatus
            },
            inActive: false
        }

        let whereTicketAssign = {
            AssigneeDepartmentId: department.id,
            inActive: false,
            status: {
                [Op.ne]: "Complete"
            }
        }

        if (userLevelDb.length === 2) {
            if (parseInt(section.level) !== 0) {
                whereTicketAssign = {
                    ...whereTicketAssign,
                    PersonInChargeId: user.id
                };
            }
        } else if (userLevelDb.length === 3) {
            if (parseInt(section.level) === 2) {
                whereTicketAssign = {
                    ...whereTicketAssign,
                    PersonInChargeId: user.id
                };
            }
        }

        const response = await models.Ticket.count({
            order: [
                ["expectDueDate", "ASC"]
            ],
            where,
            include: [{
                model: models.TicketAssignee,
                where: whereTicketAssign,
                include: [{
                    model: models.User,
                    attributes: ["id", "badgeId", "name"],
                    as: "Assignee"
                }, {
                    model: models.User,
                    attributes: ["id", "badgeId", "name"],
                    as: "PersonInCharge"
                }, {
                    model: models.Department,
                    attributes: ["id", "name"],
                    as: "AssigneeDepartment"
                }]
            }]
        });

        return res.status(200).json({
            message: "Success Fetch Work Requests Count!",
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

export const getTicketRequest = async (req, res) => {
    try {
        const { search } = req.query;

        const { user, department, section } = req.decoded;
        const responseSection = await connectionDatabase.query(`SELECT DISTINCT level FROM sections WHERE DepartmentId = '${department.id}' ORDER BY level ASC`, { type: QueryTypes.SELECT });
        const userLevelDb = responseSection.map((data) => parseInt(data.level));

        const accept = [
            { level: [0, 1, 2], userLevel: 0, status: ["Waiting Approve"] },
            { level: [0, 1, 2], userLevel: 1, status: ["Waiting Approve"] },
            { level: [0, 1], userLevel: 0, status: ["Waiting Approve"] },
        ];

        const userAccept = accept.find(({ level, userLevel }) => level.every((value, index) => value === userLevelDb[index]) && userLevel === parseInt(section.level));
        const { status: userAcceptStatus = [] } = userAccept || {};

        let where = {
            ticketStatus: {
                [Op.in]: userAcceptStatus
            },
            inActive: false
        }

        if (search) {
            where = {
                ...where,
                [Op.or]: [{
                    ticketNumber: { [Op.like]: `%${search}%` }
                }, {
                    workNumber: { [Op.like]: `%${search}%` }
                }, {
                    title: { [Op.like]: `%${search}%` }
                }, {
                    jigToolNo: { [Op.like]: `%${search}%` }
                }]
            }
        }

        let whereTicketAssign = {
            ApproverDepartmentId: department.id,
            inActive: false,
            status: {
                [Op.ne]: "Complete"
            }
        }

        const response = await models.Ticket.findAll({
            order: [
                ["expectDueDate", "ASC"]
            ],
            where,
            include: [{
                model: models.RegistrationNumber,
                attributes: ["id", "name", "format", "lastNumber"]
            }, {
                model: models.User,
                attributes: ["id", "badgeId", "name"],
                as: "Requester"
            }, {
                model: models.User,
                attributes: ["id", "badgeId", "name"],
                as: "Receiver"
            }, {
                model: models.Department,
                attributes: ["id", "name"],
                as: "RequesterDepartment"
            }, {
                model: models.Department,
                attributes: ["id", "name"],
                as: "ReceiverDepartment"
            }, {
                model: models.Line,
                attributes: ["id", "name"],
                as: "RequesterLine"
            }, {
                model: models.TicketAssignee,
                where: whereTicketAssign,
                include: [{
                    model: models.User,
                    attributes: ["id", "badgeId", "name"],
                    as: "Approver"
                }, {
                    model: models.User,
                    attributes: ["id", "badgeId", "name"],
                    as: "Assignee"
                }, {
                    model: models.User,
                    attributes: ["id", "badgeId", "name"],
                    as: "PersonInCharge"
                }, {
                    model: models.Department,
                    attributes: ["id", "name"],
                    as: "ApproverDepartment"
                }, {
                    model: models.Department,
                    attributes: ["id", "name"],
                    as: "AssigneeDepartment"
                }]
            }]
        });

        return res.status(200).json({
            message: "Success Fetch Work Requests Requested!",
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

export const getTicketRequestCount = async (req, res) => {
    try {
        const { user, department, section } = req.decoded;
        const responseSection = await connectionDatabase.query(`SELECT DISTINCT level FROM sections WHERE DepartmentId = '${department.id}' ORDER BY level ASC`, { type: QueryTypes.SELECT });
        const userLevelDb = responseSection.map((data) => parseInt(data.level));

        const accept = [
            { level: [0, 1, 2], userLevel: 0, status: ["Waiting Approve"] },
            { level: [0, 1, 2], userLevel: 1, status: ["Waiting Approve"] },
            { level: [0, 1], userLevel: 0, status: ["Waiting Approve"] },
        ];

        const userAccept = accept.find(({ level, userLevel }) => level.every((value, index) => value === userLevelDb[index]) && userLevel === parseInt(section.level));
        const { status: userAcceptStatus = [] } = userAccept || {};

        let where = {
            ticketStatus: {
                [Op.in]: userAcceptStatus
            },
            inActive: false
        }

        let whereTicketAssign = {
            ApproverDepartmentId: department.id,
            inActive: false,
            status: {
                [Op.ne]: "Complete"
            }
        }

        const response = await models.Ticket.count({
            order: [
                ["expectDueDate", "ASC"]
            ],
            where,
            include: [{
                model: models.TicketAssignee,
                where: whereTicketAssign,
                include: [{
                    model: models.User,
                    attributes: ["id", "badgeId", "name"],
                    as: "Assignee"
                }, {
                    model: models.User,
                    attributes: ["id", "badgeId", "name"],
                    as: "PersonInCharge"
                }, {
                    model: models.Department,
                    attributes: ["id", "name"],
                    as: "AssigneeDepartment"
                }]
            }]
        });

        return res.status(200).json({
            message: "Success Fetch Work Requests Requested Count!",
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

export const getWorkRequestReceive = async (req, res) => {
    try {
        const { search } = req.query;

        const { user, department, section, line } = req.decoded;
        const responseSection = await connectionDatabase.query(`SELECT DISTINCT level FROM sections WHERE DepartmentId = '${department.id}' ORDER BY level ASC`, { type: QueryTypes.SELECT });
        const userLevelDb = responseSection.map((data) => parseInt(data.level));

        const accept = [
            { level: [0, 1, 2], acceptLevel: [0, 1] },
            { level: [0, 1], acceptLevel: [0] },
        ];

        const userAccept = accept.find(({ level, acceptLevel }) => level.every((value, index) => value === userLevelDb[index]) && acceptLevel.includes(parseInt(section.level)));

        let where = {
            [Op.or]: [{ RequesterId: user.id, }, { RequesterLineId: line.id }],
            ticketStatus: "Send to the Requestor",
            inActive: false
        }

        if (search) {
            where = {
                ...where,
                [Op.or]: [{
                    ticketNumber: { [Op.like]: `%${search}%` }
                }, {
                    workNumber: { [Op.like]: `%${search}%` }
                }, {
                    title: { [Op.like]: `%${search}%` }
                }, {
                    jigToolNo: { [Op.like]: `%${search}%` }
                }]
            }
        }

        if (userAccept) {
            where = {
                ticketStatus: "Send to the Requestor",
                inActive: false
            }
            if (search) {
                where = {
                    ...where,
                    [Op.or]: [{
                        ticketNumber: { [Op.like]: `%${search}%` }
                    }, {
                        workNumber: { [Op.like]: `%${search}%` }
                    }, {
                        title: { [Op.like]: `%${search}%` }
                    }, {
                        jigToolNo: { [Op.like]: `%${search}%` }
                    }]
                }
            }
        }

        const response = await models.Ticket.findAll({
            order: [
                ["expectDueDate", "ASC"]
            ],
            where,
            include: [{
                model: models.RegistrationNumber,
                attributes: ["id", "name", "format", "lastNumber"]
            }, {
                model: models.User,
                attributes: ["id", "badgeId", "name"],
                as: "Requester"
            }, {
                model: models.User,
                attributes: ["id", "badgeId", "name"],
                as: "Receiver"
            }, {
                model: models.Department,
                attributes: ["id", "name"],
                as: "RequesterDepartment"
            }, {
                model: models.Department,
                attributes: ["id", "name"],
                as: "ReceiverDepartment"
            }, {
                model: models.Line,
                attributes: ["id", "name"],
                as: "RequesterLine"
            }, {
                model: models.TicketAssignee,
                include: [{
                    model: models.User,
                    attributes: ["id", "badgeId", "name"],
                    as: "Assignee"
                }, {
                    model: models.User,
                    attributes: ["id", "badgeId", "name"],
                    as: "PersonInCharge"
                }, {
                    model: models.Department,
                    attributes: ["id", "name"],
                    as: "AssigneeDepartment"
                }]
            }]
        });

        return res.status(200).json({
            message: "Success Fetch Work Requests Receive!",
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

export const getWorkRequestReceiveCount = async (req, res) => {
    try {
        const { user, department, section, line } = req.decoded;
        const responseSection = await connectionDatabase.query(`SELECT DISTINCT level FROM sections WHERE DepartmentId = '${department.id}' ORDER BY level ASC`, { type: QueryTypes.SELECT });
        const userLevelDb = responseSection.map((data) => parseInt(data.level));

        const accept = [
            { level: [0, 1, 2], acceptLevel: [0, 1] },
            { level: [0, 1], acceptLevel: [0] },
        ];

        const userAccept = accept.find(({ level, acceptLevel }) => level.every((value, index) => value === userLevelDb[index]) && acceptLevel.includes(parseInt(section.level)));

        let where = {
            [Op.or]: [{ RequesterId: user.id, }, { RequesterLineId: line.id }],
            ticketStatus: "Send to the Requestor",
            inActive: false
        }

        if (userAccept) {
            where = {
                RequesterDepartmentId: department.id,
                ticketStatus: "Send to the Requestor",
                inActive: false
            }
        }

        const response = await models.Ticket.count({ where });

        return res.status(200).json({
            message: "Success Fetch Work Requests Receive Count!",
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

export const getWorkRequestYear = async (req, res) => {
    try {
        const response = await connectionDatabase.query("SELECT DISTINCT YEAR(createdAt) as ticketYear FROM tickets ORDER BY ticketYear ASC", { type: QueryTypes.SELECT });
        const data = response.map((data) => data.ticketYear);
        return res.status(200).json({
            message: "Success Fetch Work Request Years!",
            data: data
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

export const getWorkRequestMonth = async (req, res) => {
    try {
        const response = await connectionDatabase.query("SELECT DISTINCT MONTH(createdAt) as ticketMonth FROM tickets ORDER BY ticketMonth ASC", { type: QueryTypes.SELECT });
        const data = response.map((data) => data.ticketMonth);
        return res.status(200).json({
            message: "Success Fetch Work Request Months!",
            data: data
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

export const getWorkRequestType = async (req, res) => {
    try {
        const response = await connectionDatabase.query("SELECT DISTINCT id,format FROM registrationnumbers WHERE id IN (SELECT DISTINCT RegistrationNumberId FROM tickets) ORDER BY format ASC", { type: QueryTypes.SELECT });
        const data = response.map((data) => ({ id: data.id, format: data.format }));
        return res.status(200).json({
            message: "Success Fetch Work Request Type!",
            data: data
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

export const getWorkRequestDepartment = async (req, res) => {
    try {
        const response = await connectionDatabase.query("SELECT DISTINCT id,name FROM departments WHERE id IN (SELECT DISTINCT RequesterDepartmentId FROM tickets) ORDER BY name ASC", { type: QueryTypes.SELECT });
        const data = response.map((data) => ({ id: data.id, name: data.name }));
        return res.status(200).json({
            message: "Success Fetch Work Request Department!",
            data: data
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

export const getWorkRequests = async (req, res) => {
    try {
        const { search } = req.query;

        const { ticketStatus, type, department, year, month } = req.params;
        const currentDate = new Date();

        let where = {
            inActive: false
        }

        if (search) {
            where = {
                ...where,
                [Op.or]: [{
                    ticketNumber: { [Op.like]: `%${search}%` }
                }, {
                    workNumber: { [Op.like]: `%${search}%` }
                }, {
                    title: { [Op.like]: `%${search}%` }
                }, {
                    jigToolNo: { [Op.like]: `%${search}%` }
                }]
            }
        }

        if (ticketStatus && ticketStatus !== "All") {
            where.ticketStatus = ticketStatus;
        }

        if (type && type !== "All") {
            where.RegistrationNumberId = type;
        }

        if (department && department !== "All") {
            where.RequesterDepartmentId = department;
        }

        const yearFilter = parseInt(year) || currentDate.getFullYear();
        const monthFilter = parseInt(month) || currentDate.getMonth() + 1;

        if (year !== "All") {
            where = {
                ...where,
                [Op.and]: [connectionDatabase.where(connectionDatabase.fn("YEAR", connectionDatabase.col("Ticket.createdAt")), yearFilter)]
            }
        }

        if (month !== "All") {
            where = {
                ...where,
                [Op.and]: [...where[Op.and], connectionDatabase.where(connectionDatabase.fn("MONTH", connectionDatabase.col("Ticket.createdAt")), monthFilter)]
            }
        }

        const response = await models.Ticket.findAll({
            order: [
                ["createdAt", "ASC"]
            ],
            where,
            include: [{
                model: models.RegistrationNumber,
                attributes: ["id", "name", "format", "lastNumber"]
            }, {
                model: models.User,
                attributes: ["id", "badgeId", "name"],
                as: "Requester"
            }, {
                model: models.User,
                attributes: ["id", "badgeId", "name"],
                as: "Receiver"
            }, {
                model: models.Department,
                attributes: ["id", "name"],
                as: "RequesterDepartment"
            }, {
                model: models.Department,
                attributes: ["id", "name"],
                as: "ReceiverDepartment"
            }, {
                model: models.Line,
                attributes: ["id", "name"],
                as: "RequesterLine"
            }, {
                model: models.TicketAssignee,
                include: [{
                    model: models.User,
                    attributes: ["id", "badgeId", "name"],
                    as: "Assignee"
                }, {
                    model: models.User,
                    attributes: ["id", "badgeId", "name"],
                    as: "PersonInCharge"
                }, {
                    model: models.Department,
                    attributes: ["id", "name"],
                    as: "AssigneeDepartment"
                }]
            }]
        });

        return res.status(200).json({
            message: "Success Fetch Work Requests!",
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

export const getWorkRequestComment = async (req, res) => {
    try {
        // Express Validator 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                isExpressValidation: true,
                data: {
                    title: "Validation Errors!",
                    message: "Validation Error!",
                    validationError: errors.array()
                }
            });
        }

        const { TicketId } = req.params;
        const response = await models.Comment.findAll({
            order: [["createdAt", "DESC"]],
            where: {
                inActive: false,
                TicketId,
            },
            include: [{
                model: models.User,
                attributes: ["id", "badgeId", "name"]
            }]
        });

        return res.status(200).json({
            message: "Success Fetch Work Request Comments!",
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

export const createWorkRequest = async (req, res) => {
    const transaction = await connectionDatabase.transaction();
    try {
        // Express Validator 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                isExpressValidation: true,
                data: {
                    title: "Validation Errors!",
                    message: "Validation Error!",
                    validationError: errors.array()
                }
            });
        }

        const { description, jigToolNo, qty, expectDueDate, RequesterDepartmentId, RequesterLineId, AssigneeDepartmentIds, RegistrationNumberId } = req.body;
        const { id, badgeId, name } = req.decoded.user;
        const { id: UserDepartmentId, name: DepartmentName } = req.decoded.department;
        const { name: LineName } = req.decoded.line;

        const responseWorkRequest = await models.Ticket.findOne({
            order: [
                ["createdAt", "DESC"]
            ]
        });

        const ticketNumber = responseWorkRequest === null ? "WR-2303-001" : generateTicketNumber(responseWorkRequest);

        const responseRegistrationNumber = await models.RegistrationNumber.findByPk(RegistrationNumberId);
        const { format, year, lastNumber } = responseRegistrationNumber;
        let newLastNumber = parseInt(lastNumber) + 1;

        await models.RegistrationNumber.update({ lastNumber: newLastNumber }, { where: { id: RegistrationNumberId }, transaction });
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const stringYear = currentYear.toString().substring(2, 4).padStart(2, "0");
        let newWorkNumber = `${format}-${stringYear}-${newLastNumber.toString().padStart(3, "0")}`;

        if (year !== currentYear) {
            await models.RegistrationNumber.update({ year: currentYear, lastNumber: 1 }, { where: { id: RegistrationNumberId }, transaction });
            newWorkNumber = `${format}-${stringYear}-${"1".toString().padStart(3, "0")}`;
        }

        let attachmentFile = undefined;

        if (req?.file?.filename) {
            let fileNamesArr = req.file.filename.split(".");
            let ext = fileNamesArr[fileNamesArr.length - 1].toLowerCase();

            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
            attachmentFile = `${format}-${currentYear}-${uniqueSuffix}.${ext}`;
            let destinationDirectory = `public/files/${format}/${currentYear}`;

            await mkdir(destinationDirectory, { recursive: true });
            copyFile(`public/files/${req.file.filename}`, `${destinationDirectory}/${attachmentFile}`, (err) => {
                if (err) {
                    errorLogging(err)
                }
            });
            unlink(`public/files/${req.file.filename}`, (err) => {
                if (err) {
                    errorLogging(err);
                }
            });

            attachmentFile = `${format}/${currentYear}/${attachmentFile}`;
        }

        const response = await models.Ticket.create({
            ticketNumber,
            workNumber: newWorkNumber,
            description,
            jigToolNo,
            qty,
            expectDueDate,
            RequesterId: id,
            RequesterDepartmentId,
            RequesterLineId: RequesterLineId || null,
            RegistrationNumberId,
            createdBy: badgeId,
            updatedBy: badgeId,
            attachmentFile,
        }, { transaction });

        if (AssigneeDepartmentIds.length === 0) {
            throw new Error("Please fill Assignee Department");
        }

        const assignDepartments = AssigneeDepartmentIds.map((res) => ({ AssigneeDepartmentId: res, ApproverDepartmentId: UserDepartmentId, createdBy: badgeId, updatedBy: badgeId, TicketId: response.id }));
        await models.TicketAssignee.bulkCreate(assignDepartments, { transaction });

        await models.Comment.create({
            title: "Create Work Request",
            text: `${badgeId} - ${name} has added a work request!`,
            TicketId: response.id,
            UserId: id,
            createdBy: badgeId,
            updatedBy: badgeId
        }, { transaction });

        // const responseUser = await models.User.findAll({
        //     where: {
        //         DepartmentId: AssigneeDepartmentId,
        //         email: { [Op.not]: null }
        //     }, transaction
        // });

        // const userEmail = responseUser.map((data) => data.email);
        // await sendMailCreateWorkRequest(userEmail, badgeId, name, DepartmentName, LineName, title, description, jigToolNo, qty, expectDueDate);
        await transaction.commit();
        return res.status(200).json({
            message: `Success Create Work Request! ${ticketNumber}`,
            data: response
        });
    } catch (err) {
        await transaction.rollback();
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

export const headActionTicket = async (req, res) => {
    const transaction = await connectionDatabase.transaction();
    try {
        // Express Validator 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                isExpressValidation: true,
                data: {
                    title: "Validation Errors!",
                    message: "Validation Error!",
                    validationError: errors.array()
                }
            });
        }

        const { id, type } = req.body;
        const { id: UserId, badgeId, name } = req.decoded.user;

        let commentTitle = type;
        let commentText = `${badgeId} - ${name} has ${type} this ticket.`;

        let updateData = {
            ticketStatus: type,
            updatedBy: badgeId
        }

        await models.Comment.create({
            title: commentTitle,
            text: commentText,
            TicketId: id,
            UserId: UserId,
            createdBy: badgeId,
            updatedBy: badgeId
        }, { transaction });

        await models.Ticket.update(updateData, { where: { id: id }, transaction });

        await transaction.commit();

        return res.status(200).json({
            message: commentText,
            data: null
        });
    } catch (err) {
        await transaction.rollback();
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

export const assignTicket = async (req, res) => {
    const transaction = await connectionDatabase.transaction();
    // Express Validator 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            isExpressValidation: true,
            data: {
                title: "Validation Errors!",
                message: "Validation Error!",
                validationError: errors.array()
            }
        });
    }

    try {
        const { id, ticketAssigneeId, PersonInChargeId, RegistrationNumberId, ticketStatus, remark } = req.body;
        const { id: UserId, badgeId, name } = req.decoded.user;

        const responsePic = await models.User.findByPk(PersonInChargeId);

        let commentTitle = "Reject";
        let commentText = `${badgeId} - ${name} refused this ticket.`;
        let updateData = {
            AssigneeId: UserId,
            ticketStatus: ticketStatus,
            updatedBy: badgeId,
            assigneeDate: new Date()
        }

        if (ticketStatus === "Progress") {
            if (PersonInChargeId === "") {
                return res.status(400).json({
                    isExpressValidation: false,
                    data: {
                        title: "Validation Errors!",
                        message: "PersonInChargeId Cannot Be Null!!"
                    }
                });
            }
            if (RegistrationNumberId === "") {
                return res.status(400).json({
                    isExpressValidation: false,
                    data: {
                        title: "Validation Errors!",
                        message: "RegistrationNumberId Cannot Be Null!!"
                    }
                });
            }

            updateData = {
                AssigneeId: UserId,
                PersonInChargeId,
                RegistrationNumberId,
                ticketStatus: ticketStatus,
                updatedBy: badgeId,
                assigneeDate: new Date()
            }

            commentTitle = "Assign";
            commentText = `${badgeId} - ${name} has assigned the ticket to ${responsePic.badgeId} - ${responsePic.name}.`;

            await models.TicketAssignee.update({ AssigneeId: UserId, PersonInChargeId, status: "Progress", assigneeDate: new Date() }, { where: { id: ticketAssigneeId }, transaction });
        } else {
            commentText = `${commentText} ${remark}`;
        }

        await models.Ticket.update(updateData, { where: { id: id }, transaction });
        await models.Comment.create({
            title: commentTitle,
            text: commentText,
            TicketId: id,
            UserId: UserId,
            createdBy: badgeId,
            updatedBy: badgeId
        }, { transaction });

        await transaction.commit();

        return res.status(200).json({
            message: commentText,
            data: null
        });
    } catch (err) {
        await transaction.rollback();
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

export const picActionTicket = async (req, res) => {
    const transaction = await connectionDatabase.transaction();
    try {
        // Express Validator 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                isExpressValidation: true,
                data: {
                    title: "Validation Errors!",
                    message: "Validation Error!",
                    validationError: errors.array()
                }
            });
        }

        const { id, ticketAssigneeId, ticketStatus, timeTaken, actionTaken, remark } = req.body;
        const { id: UserId, badgeId, name } = req.decoded.user;

        let commentTitle = "Complete";
        let commentText = `${badgeId} - ${name} has finish this ticket.`;

        if (ticketStatus === "Progress") {
            commentTitle = "Progress";
            commentText = `${badgeId} - ${name} ${remark}`;

            await models.TicketAssignee.update({
                status: ticketStatus,
                updatedBy: badgeId,
            }, { where: { id: ticketAssigneeId }, transaction });
            await models.Ticket.update({ updatedBy: badgeId }, { where: { id: id }, transaction });
        } else if (ticketStatus === "Pending") {
            commentTitle = "Pending";
            commentText = `${badgeId} - ${name} ${remark}`;
            await models.Ticket.update({ updatedBy: badgeId }, { where: { id: id }, transaction });
        } else if (ticketStatus === "Complete") {
            commentTitle = "Complete";
            commentText = `${badgeId} - ${name} was finish this ticket.`;

            await models.TicketAssignee.update({
                status: ticketStatus,
                timeTaken: timeTaken,
                actionTaken: actionTaken,
                updatedBy: badgeId
            }, { where: { id: ticketAssigneeId }, transaction });
            await models.Ticket.update({ updatedBy: badgeId }, { where: { id: id }, transaction });

            const ticketAssignCount = await models.TicketAssignee.count({ where: { TicketId: id, inActive: false } });
            const completeCount = await models.TicketAssignee.count({
                where: { TicketId: id, status: "Complete", inActive: false }
            });

            if (ticketAssignCount === completeCount + 1) {
                await models.Ticket.update({
                    ticketStatus: "Send to the Requestor",
                    sendToRequestorDate: new Date(),
                    updatedBy: badgeId
                }, { where: { id: id }, transaction });

                commentTitle = "Complete and Send to Requestor";
                commentText = `${badgeId} - ${name} has finish this ticket and sent this ticket to the requestor.`;
            }
        }

        await models.Comment.create({
            title: commentTitle,
            text: commentText,
            TicketId: id,
            UserId: UserId,
            createdBy: badgeId,
            updatedBy: badgeId
        }, { transaction });

        await transaction.commit();

        return res.status(200).json({
            message: commentText,
            data: null
        });
    } catch (err) {
        transaction.rollback();
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

export const receiveTicket = async (req, res) => {
    const transaction = await connectionDatabase.transaction();
    try {
        // Express Validator 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                isExpressValidation: true,
                data: {
                    title: "Validation Errors!",
                    message: "Validation Error!",
                    validationError: errors.array()
                }
            });
        }

        const { id } = req.body;
        const { id: UserId, badgeId, name } = req.decoded.user;
        const { id: DepartmentId } = req.decoded.department;

        let commentTitle = "Receive";
        let commentText = `This ticket was received by ${badgeId} - ${name}.`;

        await models.Ticket.update({
            ticketStatus: "Complete",
            ReceiverId: UserId,
            ReceiverDepartmentId: DepartmentId,
            completeDate: Date.now(),
            updatedAt: badgeId,
        }, { where: { id: id }, transaction });

        await models.Comment.create({
            title: commentTitle,
            text: commentText,
            createdBy: badgeId,
            updatedBy: badgeId,
            TicketId: id,
            UserId: UserId
        }, { transaction });

        await transaction.commit();

        return res.status(200).json({
            message: commentText,
            data: null
        });
    } catch (err) {
        transaction.rollback();
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

export const sendMailCreateWorkRequest = async (email, badgeId, name, department, line, title, description, jigToolNo, qty, expectDueDate) => {
    try {
        const from = `"<YAS-ID-ITD@yokogawa.com>"`;
        const to = [...new Set(email)].join(", ");
        const subject = `Create Work Request`;
        const text = title;

        let html = `
        <style>
            table {
                border-collapse: collapse;
                margin-bottom: 3em;
            }

            td {
                padding: 5px;
            }

            .table-header {
                font-weight: bold;
                width: 13em;
            }

            .table-body {
                width: 27.5em;
            }
        </style>

        <p>
            <b>*** This is an automatically generated email, please do not reply directly to this e-mail ***</b> <br> <br>
        </p>
        
        <p>Hi,</p>
        <p>${name} was created a ticket with the detail:</p>

        <table border="1">
            <tr>
                <td class="table-header">Requester BadgeId</td>
                <td class="table-body">${badgeId}</td>
            </tr>
            <tr>
                <td class="table-header">Requester Name</td>
                <td class="table-body">${name}</td>
            </tr>
            <tr>
                <td class="table-header">Requester Department</td>
                <td class="table-body">${department}</td>
            </tr>
            <tr>
                <td class="table-header">Requester Line</td>
                <td class="table-body">${line || "N/A"}</td>
            </tr>
            <tr>
                <td class="table-header">Title</td>
                <td class="table-body">${title}</td>
            </tr>
            <tr>
                <td class="table-header">N/C Jig Tool No</td>
                <td class="table-body">${jigToolNo}</td>
            </tr>
            <tr>
                <td class="table-header">Description</td>
                <td class="table-body">${description}</td>
            </tr>
            <tr>
                <td class="table-header">Qty</td>
                <td class="table-body">${qty}</td>
            </tr>
            <tr>
                <td class="table-header">Expect Due Date</td>
                <td class="table-body">${expectDueDate}</td>
            </tr>
        </table>

        <p>If you have any questions, please contact Razky.Josefa@yokogawa.com / Muhammad.Rafael@yokogawa.com / Erna.Nadira@yokogawa.com</p>
        <p>Information System Dept</p>
        
        <p>Regards,</p>
        `;

        await transporter.sendMail({
            from: from,
            to: to,
            subject: subject,
            text: text,
            html: html
        });
    } catch (err) {
        errorLogging(err.toString());
        throw new Error(err.toString());
    }
}

export const updateWorkRequest = async (req, res) => {
    const transaction = await connectionDatabase.transaction();
    try {
        // Express Validator 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                isExpressValidation: true,
                data: {
                    title: "Validation Errors!",
                    message: "Validation Error!",
                    validationError: errors.array()
                }
            });
        }

        const { id, ticketNumber, description, jigToolNo, qty, expectDueDate } = req.body;
        const { id: UserId, badgeId, name } = req.decoded.user;

        let commentTitle = "Update";
        let commentText = `${badgeId} - ${name} has update this ticket.`;

        await models.Comment.create({
            title: commentTitle,
            text: commentText,
            TicketId: id,
            UserId: UserId,
            createdBy: badgeId,
            updatedBy: badgeId
        }, { transaction });

        let updateData = {
            ticketNumber,
            description,
            jigToolNo,
            qty,
            expectDueDate
        };

        let attachmentFile = undefined;

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const stringYear = currentYear.toString().substring(2, 4).padStart(2, "0");

        if (req?.file?.filename) {

            const responseTicket = await models.Ticket.findByPk(id);
            const responseRegistrationNumber = await models.RegistrationNumber.findByPk(responseTicket.RegistrationNumberId);

            const { format } = responseRegistrationNumber;

            let fileNamesArr = req.file.filename.split(".");
            let ext = fileNamesArr[fileNamesArr.length - 1].toLowerCase();

            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
            attachmentFile = `${format}-${currentYear}-${uniqueSuffix}.${ext}`;
            let destinationDirectory = `public/files/${format}/${currentYear}`;

            await mkdir(destinationDirectory, { recursive: true });
            copyFile(`public/files/${req.file.filename}`, `${destinationDirectory}/${attachmentFile}`, (err) => {
                if (err) {
                    errorLogging(err)
                }
            });
            unlink(`public/files/${req.file.filename}`, (err) => {
                if (err) {
                    errorLogging(err);
                }
            });

            attachmentFile = `${format}/${currentYear}/${attachmentFile}`;
        }

        if (attachmentFile !== undefined) {
            updateData = { ...updateData, attachmentFile };
        }

        console.log({ updateData });

        await models.Ticket.update(updateData, {
            where: {
                id: id
            }, transaction
        })

        await transaction.commit();

        return res.status(200).json({
            message: commentText,
            data: null
        });
    } catch (err) {
        transaction.rollback();
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