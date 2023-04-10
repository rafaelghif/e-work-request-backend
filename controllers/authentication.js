import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { errorLogging } from "../helpers/error.js";
import models from "../models/index.js";

export const authentication = async (req, res) => {
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

        const { badgeId, password } = req.body;

        const response = await models.User.findOne({
            attributes: ["id", "badgeId", "password", "name", "email", "role"],
            where: {
                badgeId: badgeId,
                inActive: false
            },
            include: [{
                model: models.Department,
                attributes: ["id", "name", "abbreviation"],
                where: {
                    inActive: false
                },
                required: true,
            }, {
                model: models.Section,
                attributes: ["id", "name", "level"],
                where: {
                    inActive: false
                },
                required: true
            }, {
                model: models.Line,
                attributes: ["id", "name"],
                where: {
                    inActive: false
                },
                required: false
            }]
        });

        if (response === null) {
            return res.status(400).json({
                isExpressValidation: false,
                data: {
                    title: "Authentication Failed!",
                    message: "Badge Id Not Found! Please Contact Engineering!"
                }
            });
        }

        if (!bcrypt.compareSync(password, response.password)) {
            return res.status(400).json({
                isExpressValidation: false,
                data: {
                    title: "Authentication Failed!",
                    message: "Wrong Password! Please Contact Engineering!"
                }
            });
        }

        const data = {
            user: {
                id: response.id,
                badgeId: response.badgeId,
                name: response.name,
                email: response.email,
                role: response.role,
            },
            department: {
                id: response.Department.id,
                name: response.Department.name,
                abbreviation: response.Department.abbreviation,
            },
            section: {
                id: response.Section.id,
                name: response.Section.name,
                level: response.Section.level,
            },
            line: {
                id: response.Line?.id || "",
                name: response.Line?.name || "",
            }
        }

        const token = jwt.sign(data, process.env.JWT_KEY, { expiresIn: "3h" });

        return res.status(200).json({
            message: `Welcome ${data.user.name}`,
            data: {
                token: token,
                user: data.user,
                department: data.department,
                section: data.section,
                line: data.line
            }
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