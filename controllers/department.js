import { validationResult } from "express-validator";
import { Op } from "sequelize";
import { errorLogging } from "../helpers/error.js";
import models from "../models/index.js";

export const getDepartments = async (req, res) => {
    try {
        const { search } = req.query;
        var where = {}
        if (search !== "") {
            where = {
                name: {
                    [Op.like]: `%${search}%`
                },
            }
        }

        const response = await models.Department.findAll({
            order: [
                ["name", "ASC"]
            ],
            where
        });

        return res.status(200).json({
            message: "Success Fetch Departments!",
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

export const getActiveDepartments = async (req, res) => {
    try {
        const response = await models.Department.findAll({
            order: [
                ["name", "ASC"]
            ],
            where: {
                inActive: false,
            }
        });

        return res.status(200).json({
            message: "Success Fetch Departments!",
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

export const createDepartment = async (req, res) => {
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

        const { name, abbreviation } = req.body;
        const { badgeId } = req.decoded.user;

        const response = await models.Department.create({
            name: name,
            abbreviation: abbreviation,
            createdBy: badgeId,
            updatedBy: badgeId
        });

        return res.status(200).json({
            message: `Success Create Department!`,
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

export const updateDepartment = async (req, res) => {
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

        const { id, name, abbreviation } = req.body;
        const { badgeId } = req.decoded.user;

        const response = await models.Department.update({
            name: name,
            abbreviation: abbreviation,
            updatedBy: badgeId
        }, {
            where: {
                id: id
            }
        });

        return res.status(200).json({
            message: `Success Update Department!`,
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

export const inActiveDepartment = async (req, res) => {
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

        const { departmentId } = req.params;
        const { badgeId } = req.decoded.user;

        const response = await models.Department.update({
            inActive: true,
            updatedBy: badgeId,
        }, {
            where: {
                id: departmentId
            }
        });

        return res.status(200).json({
            message: `Success InActive Department!`,
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

export const getTicketAssigneeDepartment = async (req, res) => {
    try {
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

        const { ticketId } = req.params;

        const response = await models.TicketAssignee.findAll({
            attributes: ["id"],
            where: {
                TicketId: ticketId,
            },
            include: [{
                model: models.Department,
                attributes: ["id", "name","abbreviation"],
                as: "AssigneeDepartment"
            }]
        });

        return res.status(200).json({
            message: "Success Fetch Ticket Assignee Department!",
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