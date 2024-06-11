import * as fns from "date-fns";
import { validationResult } from "express-validator/src/validation-result.js";
import * as fs from "fs";
import path from "path";
import { Op } from "sequelize";
import * as XLSX from "xlsx/xlsx.mjs";

import connectionDatabase from "../configs/database.js";
import { errorLogging } from "../helpers/error.js";
import models from "../models/index.js";

export const formatDate = (stringDate, cols, ticketType) => {
	try {
		if (stringDate === " ") {
			return null;
		}
		return fns.format(Date.parse(stringDate), "yyyy-MM-dd", {
			timeZone: "Asia/Jakarta",
		});
	} catch (err) {
		console.log(err);
		let datas = `${ticketType},${cols["__EMPTY_2"]}\n`;
		fs.appendFile(
			"D:/40703191/Programming/NodeJS/Personal/e-work-request/e-work-request-backend/logs/errors/2023/05/error-data.csv",
			datas,
			(error) => {
				if (error) {
					console.log(error);
				}
			},
		);
	}
};

export const getTickets = async (req, res) => {
	try {
		const { search } = req.query;

		const { year, month, type } = req.params;
		const currentDate = new Date();

		let where = {};

		if (search) {
			where = {
				[Op.or]: [
					{
						woNo: { [Op.like]: `%${search}%` },
					},
					{
						ticketNo: { [Op.like]: `%${search}%` },
					},
					{
						location: { [Op.like]: `%${search}%` },
					},
					{
						description: { [Op.like]: `%${search}%` },
					},
					{
						remark: { [Op.like]: `%${search}%` },
					},
				],
			};
		}

		if (type !== "All") {
			where.ticketType = type;
		}

		const yearFilter = parseInt(year) || currentDate.getFullYear();
		const monthFilter = parseInt(month) || currentDate.getMonth() + 1;

		if (year !== "All") {
			where = {
				...where,
				[Op.and]: [
					connectionDatabase.where(
						connectionDatabase.fn(
							"YEAR",
							connectionDatabase.col("TicketOld.receivedDate"),
						),
						yearFilter,
					),
				],
			};
		}

		if (month !== "All") {
			const condition =
				year !== "All"
					? {
						[Op.and]: [
							...where[Op.and],
							connectionDatabase.where(
								connectionDatabase.fn(
									"MONTH",
									connectionDatabase.col(
										"TicketOld.receivedDate",
									),
								),
								monthFilter,
							),
						],
					}
					: {
						[Op.and]: [
							connectionDatabase.where(
								connectionDatabase.fn(
									"MONTH",
									connectionDatabase.col(
										"TicketOld.receivedDate",
									),
								),
								monthFilter,
							),
						],
					};
			where = {
				...where,
				...condition,
			};
		}

		const response = await models.TicketOld.findAll({
			order: [["receivedDate", "ASC"]],
			where,
		});

		return res.status(200).json({
			message: "Success Fetch Ticket Old!",
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

export const updateTicket = async (req, res) => {
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

		const {
			id,
			ticketNo,
			location,
			description,
			remark,
			receivedDate,
			completedDate,
		} = req.body;
		const { badgeId } = req.decoded.user;

		const ticketStatus =
			receivedDate !== null && completedDate !== null
				? "COMPLETE"
				: "OPEN";

		await models.TicketOld.update(
			{
				location,
				description,
				remark,
				receivedDate,
				completedDate,
				ticketStatus,
				updatedBy: badgeId,
			},
			{
				where: { id },
			},
		);

		return res.status(200).json({
			message: `Success Update Work Request old! ${ticketNo}`,
			data: null,
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

export const importTicket = async (req, res) => {
	try {
		const directoryPath =
			"D:/40703191/Programming/NodeJS/Personal/Ionic/e-work-request/e-work-request-backend/public/ticket/old";

		XLSX.set_fs(fs);

		const data = [
			{
				type: "FJ",
				fileName: "WO-FJ Fabrication of Jig (New Jig).xlsx",
			},
			{
				type: "MB",
				fileName: "WO-MB Maintenance for Bending Tools.xlsx",
			},
			{
				type: "MD",
				fileName: "WO-MD Maintenance for Mold Die.xlsx",
			},
			{
				type: "MG",
				fileName:
					"WO-MG Maintenance for General work for factory facility.xlsx",
			},
			{
				type: "MJ",
				fileName: "WO-MJ Maintenance for Jig.xlsx",
			},
			{
				type: "MM",
				fileName: "WO-MM Repair of Machine  production tools.xlsx",
			},
			{
				type: "MP",
				fileName: "WO-MP Maintenance for Press Die.xlsx",
			},
			{
				type: "NY",
				fileName: "WO-NY Maintenance for NCT Tools.xlsx",
			},
			{
				type: "WS",
				fileName:
					"WO-WS Request for creating a new or revising worksheet (form go to PED).xlsx",
			},
		];

		const promises = data.map((res) => {
			let ticketType = res.type;
			const filePath = path.join(directoryPath, res.fileName);
			const file = XLSX.readFile(filePath, { cellDates: true });

			const sheets = file.SheetNames;

			sheets.map(async (sheet) => {
				const rows = XLSX.utils.sheet_to_json(file.Sheets[sheet]);
				for (const cols of rows) {
					if (cols["Description Of Problem"]) {
						if (cols["Description Of Problem"] === "") {
							break;
						}

						if (
							cols["Description Of Problem"] &&
							!cols["Location"]
						) {
							continue;
						}

						const woNo = cols["WORK ORDER REGISTRATION"]
							? cols["WORK ORDER REGISTRATION"].trim()
							: "";
						const workOrderNo = cols["No."]
							? cols["No."].trim()
							: "";
						const location = cols["Location"].trim();
						const description =
							cols["Description Of Problem"].trim();
						const receivedDate = cols["Received"]
							? formatDate(cols["Received"], cols, ticketType)
							: null;
						const completedDate = cols["Completed"]
							? formatDate(cols["Completed"], cols, ticketType)
							: null;
						const remark = cols["Remarks"]
							? cols["Remarks"].trim()
							: null;

						await models.TicketOld.create(
							{
								woNo,
								ticketNo: workOrderNo,
								location,
								description,
								remark,
								receivedDate,
								completedDate,
								ticketType,
								createdBy: "SYSTEM",
								updatedBy: "SYSTEM",
							},
							{ logging: false },
						);
					}

					if (cols["__EMPTY_2"]) {
						if (cols["__EMPTY_2"] === "") {
							break;
						}

						if (cols["__EMPTY_2"] && !cols["__EMPTY_1"]) {
							continue;
						}

						if (
							cols["__EMPTY"] === "No." ||
							cols["__EMPTY_1"] === "Location" ||
							cols["__EMPTY_2"] === "Description Of Problem"
						) {
							continue;
						}

						const woNo = cols["WORK ORDER REGISTRATION"]
							? cols["WORK ORDER REGISTRATION"].trim()
							: "";
						const workOrderNo = cols["__EMPTY"]
							? cols["__EMPTY"].toString().trim()
							: "";
						const location = cols["__EMPTY_1"].toString().trim();
						const description = cols["__EMPTY_2"].toString().trim();
						const receivedDate = cols["__EMPTY_3"]
							? formatDate(cols["__EMPTY_3"], cols, ticketType)
							: null;
						const completedDate = cols["__EMPTY_4"]
							? formatDate(cols["__EMPTY_4"], cols, ticketType)
							: null;
						const remark = cols["__EMPTY_5"]
							? cols["__EMPTY_5"].toString().trim()
							: null;

						const ticketStatus =
							receivedDate !== null && completedDate !== null
								? "COMPLETE"
								: "OPEN";

						await models.TicketOld.create(
							{
								woNo,
								ticketNo: workOrderNo,
								location,
								description,
								remark,
								receivedDate,
								completedDate,
								ticketType,
								ticketStatus,
								createdBy: "SYSTEM",
								updatedBy: "SYSTEM",
							},
							{ logging: false },
						);
					}
				}
			});
		});

		await Promise.all(promises);

		return res.status(200).json({
			message: "Success Import!",
			data: null,
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
