import { validationResult } from "express-validator";
import { QueryTypes } from "sequelize";

import connectionDatabase from "../configs/database.js";
import { errorLogging } from "../helpers/error.js";

export const getChartBackLogs = async (req, res) => {
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

		const { month, year } = req.params;

		let groupByArr = [];
		let groupBy = "";

		const whereArr = [];
		let where = "";

		if (month !== "All") {
			whereArr.push(`MONTH(expectDueDate) = '${month}'`);
			groupByArr.push("MONTH(expectDueDate)");
		}

		if (year !== "All") {
			whereArr.push(`YEAR(expectDueDate) = '${year}'`);
			groupByArr.push("YEAR(expectDueDate)");
		}

		if (whereArr.length > 0) {
			where = `WHERE ${whereArr.join(" AND ")}`;
		}

		groupBy = groupByArr.join(",");

		const query = `
            SELECT
                registrationNumberId,
                registrationNumberFormat,
                COUNT(*) AS total
            FROM
                v_backlog_by_registration_number
                ${where}
            GROUP BY
                registrationNumberId,
                registrationNumberFormat,
                ${groupBy};
        `;

		const response = await connectionDatabase.query(query, {
			type: QueryTypes.SELECT,
		});

		const data = response.map((res) => ({
			registrationNumberId: res.registrationNumberId,
			label: res.registrationNumberFormat,
			value: res.total,
		}));

		return res.status(200).json({
			message: "Success Fetch Data Chart Backlogs!",
			data: data,
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

export const getBacklogs = async (req, res) => {
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

		const { month, year, registrationNumberId } = req.params;
		const whereArr = [];

		let where = `WHERE registrationNumberId = '${registrationNumberId}' AND expectDueDate <= CURDATE()`;

		if (month !== "All") {
			whereArr.push(`MONTH(expectDueDate) = '${month}'`);
		}

		if (year !== "All") {
			whereArr.push(`YEAR(expectDueDate) = '${year}'`);
		}

		if (whereArr.length > 0) {
			where += ` AND ${whereArr.join(" AND ")}`;
		}

		const response = await connectionDatabase.query(
			`SELECT * FROM v_ticket ${where} ORDER BY expectDueDate ASC`,
			{ type: QueryTypes.SELECT },
		);
		return res.status(200).json({
			message: "Success Fetch Data Backlogs!",
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

export const getChartOutstanding = async (req, res) => {
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

		const { month, year } = req.params;

		const whereArr = [];
		let where = "";

		let groupByArr = [];
		let groupBy = "";

		if (month !== "All") {
			whereArr.push(`MONTH(expectDueDate) = '${month}'`);
			groupByArr.push("MONTH(expectDueDate)");
		}

		if (year !== "All") {
			whereArr.push(`YEAR(expectDueDate) = '${year}'`);
			groupByArr.push("YEAR(expectDueDate)");
		}

		if (whereArr.length > 0) {
			where = `WHERE ${whereArr.join(" AND ")}`;
		}

		groupBy = groupByArr.join(",");

		const query = `
        SELECT
            registrationNumberId,
            registrationNumberFormat,
            COUNT(*) AS total
        FROM
            v_outstanding_by_registration_number
            ${where}
        GROUP BY
            registrationNumberId,
            registrationNumberFormat,
            ${groupBy};
        `;

		const response = await connectionDatabase.query(query, {
			type: QueryTypes.SELECT,
		});

		const data = response.map((res) => ({
			registrationNumberId: res.registrationNumberId,
			label: res.registrationNumberFormat,
			value: res.total,
		}));

		return res.status(200).json({
			message: "Success Fetch Data Chart Backlogs!",
			data: data,
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

export const getOutstanding = async (req, res) => {
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

		const { month, year, registrationNumberId } = req.params;
		const whereArr = [];

		let where = `WHERE registrationNumberId = '${registrationNumberId}'`;

		if (month !== "All") {
			whereArr.push(`MONTH(expectDueDate) = '${month}'`);
		}

		if (year !== "All") {
			whereArr.push(`YEAR(expectDueDate) = '${year}'`);
		}

		if (whereArr.length > 0) {
			where += ` AND ${whereArr.join(" AND ")}`;
		}

		const response = await connectionDatabase.query(
			`SELECT * FROM v_ticket ${where} ORDER BY expectDueDate ASC`,
			{ type: QueryTypes.SELECT },
		);
		return res.status(200).json({
			message: "Success Fetch Data Backlogs!",
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

export const getChartDueDate = async (req, res) => {
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

		const { month, year } = req.params;

		const whereArr = [];
		let where = "";

		if (month !== "All") {
			whereArr.push(`MONTH(expectDueDate) = '${month}'`);
		}

		if (year !== "All") {
			whereArr.push(`YEAR(expectDueDate) = '${year}'`);
		}

		if (whereArr.length > 0) {
			where = `WHERE ${whereArr.join(" AND ")}`;
		}

		const response = await connectionDatabase.query(
			`
        SELECT
            expectDueDate AS label,
            COUNT(*) AS total
        FROM
            v_ticket
            ${where}
        GROUP BY
            expectDueDate
        ORDER BY
            expectDueDate ASC;
        `,
			{ type: QueryTypes.SELECT },
		);

		return res.status(200).json({
			message: "Success Fetch Data Chart Ticket Due Date!",
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

export const getDueDates = async (req, res) => {
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

		const { dueDate } = req.params;

		let where = `WHERE expectDueDate = '${dueDate}'`;

		const response = await connectionDatabase.query(
			`SELECT* FROM v_ticket ${where} ;`,
			{ type: QueryTypes.SELECT },
		);

		return res.status(200).json({
			message: "Success Fetch Data Ticket Due Date!",
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
