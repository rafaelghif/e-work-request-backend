import { validationResult } from "express-validator";

import { errorLogging } from "../helpers/error.js";
import models from "../models/index.js";

export const getRegistrationNumbers = async (req, res) => {
	try {
		const response = await models.RegistrationNumber.findAll({
			order: [["name", "ASC"]],
		});

		return res.status(200).json({
			message: "Success Fetch Registration Number!",
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

export const getActiveRegistrationNumbers = async (req, res) => {
	try {
		const response = await models.RegistrationNumber.findAll({
			order: [["name", "ASC"]],
			where: {
				inActive: false,
			},
		});

		return res.status(200).json({
			message: "Success Fetch Registration Number!",
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

export const createRegistrationNumber = async (req, res) => {
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

		const { name, format, year } = req.body;
		const { badgeId } = req.decoded.user;

		const response = await models.RegistrationNumber.create({
			name: name,
			format: format,
			year: year,
			createdBy: badgeId,
			updatedBy: badgeId,
		});

		return res.status(200).json({
			message: "Success Create Registration Number!",
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

export const updateRegistrationNumber = async (req, res) => {
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

		const { id, name, format, year, lastNumber } = req.body;
		const { badgeId } = req.decoded.user;

		const response = await models.RegistrationNumber.update(
			{
				name: name,
				format: format,
				year: year,
				lastNumber: lastNumber,
				updatedBy: badgeId,
			},
			{
				where: {
					id: id,
				},
			},
		);

		return res.status(200).json({
			message: "Success Update Registration Number!",
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

export const inActiveRegistrationNumber = async (req, res) => {
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

		const { registrationNumberId } = req.params;
		const { badgeId } = req.decoded.user;

		const response = await models.RegistrationNumber.update(
			{
				inActive: true,
				updatedBy: badgeId,
			},
			{
				where: {
					id: registrationNumberId,
				},
			},
		);

		return res.status(200).json({
			message: "Success InActive Registration Number!",
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
