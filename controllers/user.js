import { validationResult } from "express-validator";
import { Op } from "sequelize";
import { errorLogging } from "../helpers/error.js";
import models from "../models/index.js";

export const getUsers = async (req, res) => {
    try {
        const { search } = req.query;
        var where = {}
        if (search !== "") {
            where = {
                [Op.or]: [{
                    badgeId: {
                        [Op.like]: `%${search}%`
                    }
                }, {
                    name: {
                        [Op.like]: `%${search}%`
                    }
                }, {
                    email: {
                        [Op.like]: `%${search}%`
                    }
                }]
            }
        }

        const response = await models.User.findAll({
            order: [
                ["badgeId", "ASC"]
            ],
            include: [{
                model: models.Department,
                attributes: ["name"]
            }, {
                model: models.Section,
                attributes: ["name"]
            }, {
                model: models.Line,
                attributes: ["name"]
            }],
            where: where,
        });

        return res.status(200).json({
            message: "Success Fetch Users!",
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

export const getPics = async (req, res) => {
    try {
        const { section, department } = req.decoded;
        const response = await models.User.findAll({
            attributes: ["id", "badgeId", "name", "email"],
            order: [["name", "ASC"]],
            where: {
                DepartmentId: department.id,
                inActive: false
            },
            include: [{
                model: models.Section,
                attributes: [],
                where: {
                    level: {
                        [Op.gte]: section.level
                    },
                    inActive: false
                }
            }]
        });

        return res.status(200).json({
            message: "Success Fetch PIC!",
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

export const createUser = async (req, res) => {
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

        const { badgeId, password, name, email, role, DepartmentId, SectionId, LineId } = req.body;
        const user = req.decoded.user;

        const response = await models.User.create({
            badgeId: badgeId,
            password: password,
            name: name,
            email: email ? email : null,
            role: role,
            createdBy: user.badgeId,
            updatedBy: user.badgeId,
            DepartmentId: DepartmentId,
            SectionId: SectionId,
            LineId: LineId || null
        });

        return res.status(200).json({
            message: `Success Create User!`,
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

export const updateUser = async (req, res) => {
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

        const { id, badgeId, password, name, email, role, DepartmentId, SectionId, LineId } = req.body;
        const user = req.decoded.user;

        const responseUser = await models.User.findByPk(id);

        const data = {
            badgeId,
            name,
            email: email ? email : null,
            role,
            DepartmentId,
            SectionId,
            LineId: LineId || null,
            updatedBy: user.badgeId,
            password: responseUser.password === password ? undefined : password,
        }

        await responseUser.update(data);

        return res.status(200).json({
            message: "Success Update User!",
            data: responseUser
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

export const inActiveUser = async (req, res) => {
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

        const { userId } = req.params;
        const { badgeId } = req.decoded.user;

        const response = await models.User.update({
            inActive: true,
            updatedBy: badgeId,
        }, {
            where: {
                id: userId
            }
        });

        return res.status(200).json({
            message: "Success InActive User!",
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