import { validationResult } from "express-validator";
import { Op } from "sequelize";

import { errorLogging } from "../helpers/error.js";
import models from "../models/index.js";

export const getSections = async (req, res) => {
	try {
		const { search } = req.query;
		var where = {};
		if (search !== "") {
			where = {
				name: {
					[Op.like]: `%${search}%`,
				},
			};
		}

		const response = await models.Section.findAll({
			order: [["name", "ASC"]],
			where,
		});

		return res.status(200).json({
			message: "Success Fetch Sections!",
			data: response,
		});
	} catch (err) {
		errorLogging(err.toString());
		return res.status(400).json({
			isExpressValidation: false,
			data: {
				title: "Something Wrong!",
				message: err.toString(),
			},
		});
	}
};

export const getSectionByDepartment = async (req, res) => {
	try {
		// Express Validator
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				isExpressValidation: true,
				data: {
					title: "Validation Errors!",
					message: "Validation Error!",
					validationError: errors.array(),
				},
			});
		}

		const { departmentId } = req.params;

		const response = await models.Section.findAll({
			where: {
				DepartmentId: departmentId,
			},
			order: [["name", "ASC"]],
		});

		return res.status(200).json({
			message: "Success Fetch Sections!",
			data: response,
		});
	} catch (err) {
		errorLogging(err.toString());
		return res.status(400).json({
			isExpressValidation: false,
			data: {
				title: "Something Wrong!",
				message: err.toString(),
			},
		});
	}
};

export const getActiveSectionByDepartment = async (req, res) => {
	try {
		// Express Validator
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				isExpressValidation: true,
				data: {
					title: "Validation Errors!",
					message: "Validation Error!",
					validationError: errors.array(),
				},
			});
		}

		const { departmentId } = req.params;

		const response = await models.Section.findAll({
			where: {
				DepartmentId: departmentId ?? "",
				inActive: false,
			},
			order: [["name", "ASC"]],
		});

		return res.status(200).json({
			message: "Success Fetch Sections!",
			data: response,
		});
	} catch (err) {
		errorLogging(err.toString());
		return res.status(400).json({
			isExpressValidation: false,
			data: {
				title: "Something Wrong!",
				message: err.toString(),
			},
		});
	}
};

export const createSection = async (req, res) => {
	try {
		// Express Validator
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				isExpressValidation: true,
				data: {
					title: "Validation Errors!",
					message: "Validation Error!",
					validationError: errors.array(),
				},
			});
		}

		const { name, level, departmentId } = req.body;
		const { badgeId } = req.decoded.user;

		const response = await models.Section.create({
			name: name,
			level: level,
			createdBy: badgeId,
			updatedBy: badgeId,
			DepartmentId: departmentId,
		});

		return res.status(200).json({
			message: "Success Create Section!",
			data: response,
		});
	} catch (err) {
		errorLogging(err.toString());
		return res.status(400).json({
			isExpressValidation: false,
			data: {
				title: "Something Wrong!",
				message: err.toString(),
			},
		});
	}
};

export const updateSection = async (req, res) => {
	try {
		// Express Validator
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				isExpressValidation: true,
				data: {
					title: "Validation Errors!",
					message: "Validation Error!",
					validationError: errors.array(),
				},
			});
		}

		const { id, name, level, DepartmentId } = req.body;
		const { badgeId } = req.decoded.user;

		const response = await models.Section.update(
			{
				name: name,
				level: level,
				updatedBy: badgeId,
				DepartmentId: DepartmentId,
			},
			{
				where: {
					id: id,
				},
			},
		);

		return res.status(200).json({
			message: "Success Update Section!",
			data: response,
		});
	} catch (err) {
		errorLogging(err.toString());
		return res.status(400).json({
			isExpressValidation: false,
			data: {
				title: "Something Wrong!",
				message: err.toString(),
			},
		});
	}
};

export const inActiveSection = async (req, res) => {
	try {
		// Express Validator
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				isExpressValidation: true,
				data: {
					title: "Validation Errors!",
					message: "Validation Error!",
					validationError: errors.array(),
				},
			});
		}

		const { sectionId } = req.params;
		const { badgeId } = req.decoded.user;

		const response = await models.Section.update(
			{
				inActive: true,
				updatedBy: badgeId,
			},
			{
				where: {
					id: sectionId,
				},
			},
		);

		return res.status(200).json({
			message: "Success InActive Section!",
			data: response,
		});
	} catch (err) {
		errorLogging(err.toString());
		return res.status(400).json({
			isExpressValidation: false,
			data: {
				title: "Something Wrong!",
				message: err.toString(),
			},
		});
	}
};
