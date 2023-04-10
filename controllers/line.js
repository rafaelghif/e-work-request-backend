import { validationResult } from "express-validator";
import { Op } from "sequelize";
import { errorLogging } from "../helpers/error.js";
import models from "../models/index.js";

export const getLines = async (req, res) => {
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

        const response = await models.Line.findAll({
            order: [
                ["name", "ASC"]
            ],
            include: [{
                model: models.Department,
                attributes: ["name"]
            }],
            where: where
        });

        return res.status(200).json({
            message: "Success Fetch Lines!",
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

export const getActiveLineByDepartment = async (req, res) => {
    try {

        const { departmentId } = req.params;

        const response = await models.Line.findAll({
            order: [
                ["name", "ASC"]
            ],
            include: [{
                model: models.Department,
                attributes: ["name"]
            }],
            where: {
                DepartmentId: departmentId,
                inActive: false
            }
        });

        return res.status(200).json({
            message: "Success Fetch Lines!",
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

export const getActiveLine = async (req, res) => {
    try {

        const { departmentId } = req.params;

        const response = await models.Line.findAll({
            order: [
                ["name", "ASC"]
            ],
            include: [{
                model: models.Department,
                attributes: ["name"]
            }],
            where: {
                inActive: false
            }
        });

        return res.status(200).json({
            message: "Success Fetch Lines!",
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

export const createLine = async (req, res) => {
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

        const { name, DepartmentId } = req.body;
        const { badgeId } = req.decoded.user;

        const response = await models.Line.create({
            name: name,
            DepartmentId: DepartmentId,
            createdBy: badgeId,
            updatedBy: badgeId
        });

        return res.status(200).json({
            message: `Success Create Line!`,
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

export const updateLine = async (req, res) => {
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

        const { id, name, DepartmentId } = req.body;
        const { badgeId } = req.decoded.user;

        const response = await models.Line.update({
            name: name,
            DepartmentId: DepartmentId,
            updatedBy: badgeId
        }, {
            where: {
                id: id
            }
        });

        return res.status(200).json({
            message: `Success Update Line!`,
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

export const inActiveLine = async (req, res) => {
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

        const { lineId } = req.params;
        const { badgeId } = req.decoded.user;

        const response = await models.Line.update({
            inActive: true,
            updatedBy: badgeId
        }, {
            where: {
                id: lineId
            }
        });

        return res.status(200).json({
            message: `Success InActive Line!`,
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