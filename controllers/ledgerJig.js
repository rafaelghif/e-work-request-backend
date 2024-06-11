import { validationResult } from "express-validator";
import * as fs from "fs";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { Op } from "sequelize";
import * as XLSX from "xlsx/xlsx.mjs";

import connectionDatabase from "../configs/database.js";
import { errorLogging } from "../helpers/error.js";
import models from "../models/index.js";

export const getJigs = async (req, res) => {
	try {
		const { search } = req.query;

		let where = {};

		if (search) {
			where = {
				...where,
				[Op.or]: [
					{ regNo: { [Op.like]: `%${search}%` } },
					{ name: { [Op.like]: `%${search}%` } },
					{ location: { [Op.like]: `%${search}%` } },
					{ remark: { [Op.like]: `%${search}%` } },
					{ status: { [Op.like]: `%${search}%` } },
				],
			};
		}

		const response = await models.LedgerJig.findAll({
			order: [["sequence", "DESC"]],
			where,
		});

		return res.status(200).json({
			message: "Success Fetch Ledger Jigs!",
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

export const getDetailJig = async (req, res) => {
	try {
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

		const { jigId } = req.params;

		const response = await models.LedgerJigDetail.findAll({
			order: [["regNo", "DESC"]],
			where: {
				LedgerJigId: jigId,
			},
		});

		return res.status(200).json({
			message: "Success Fetch Ledger Jigs Detail!",
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

export const getJigDetailHistory = async (req, res) => {
	try {
		const { jigDetailId } = req.params;

		const response = await models.LedgerJigDetailHistory.findAll({
			order: [["regNo", "DESC"]],
			where: {
				LedgerJigDetailId: jigDetailId,
			},
		});

		return res.status(200).json({
			message: "Success Fetch Ledger Jigs Detail History!",
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

export const getLastSequence = async (req, res) => {
	try {
		const response = await models.LedgerJig.findOne({
			order: [["sequence", "DESC"]],
		});

		let data = response;

		if (!response) {
			data = {
				sequence: 0,
			};
		}

		return res.status(200).json({
			message: "Success Fetch Last Sequence Ledger Jigs!",
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

export const createJig = async (req, res) => {
	try {
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

		const { regNo, sequence, location, maker, name, qty, remark } =
			req.body;
		const { badgeId } = req.decoded.user;

		const response = await models.LedgerJig.create({
			regNo,
			sequence,
			name,
			maker,
			location,
			qty,
			remark,
			createdBy: badgeId,
			updatedBy: badgeId,
		});

		return res.status(200).json({
			message: "Success Create Jig!",
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

export const createJigDetail = async (req, res) => {
	try {
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
			regNo,
			approveBy,
			checkedBy,
			makeBy,
			registrationDate,
			machineUse,
			partNo,
			partName,
			acquiredDate,
			location,
			LedgerJigId,
		} = req.body;
		const { badgeId } = req.decoded.user;

		let fileName = undefined;

		if (req?.file?.filename) {
			fileName = req.file.filename;
		}

		const response = await models.LedgerJigDetail.create({
			regNo,
			approveBy,
			checkedBy,
			makeBy,
			registrationDate,
			machineUse,
			partNo,
			partName,
			acquiredDate,
			location,
			fileName,
			createdBy: badgeId,
			updatedBy: badgeId,
			LedgerJigId: LedgerJigId,
		});

		return res.status(200).json({
			message: "Success Create Jig Detail!",
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

export const updateJig = async (req, res) => {
	try {
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
			regNo,
			sequence,
			location,
			maker,
			name,
			qty,
			remark,
			status,
		} = req.body;
		const { badgeId } = req.decoded.user;

		const response = await models.LedgerJig.update(
			{
				regNo,
				sequence,
				name,
				maker,
				location,
				qty,
				remark,
				status,
				updatedBy: badgeId,
			},
			{ where: { id } },
		);

		return res.status(200).json({
			message: "Success Create Jig!",
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

export const updateJigDetail = async (req, res) => {
	const transaction = await connectionDatabase.transaction();
	try {
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
			regNo,
			approveBy,
			checkedBy,
			makeBy,
			registrationDate,
			machineUse,
			partNo,
			partName,
			acquiredDate,
			location,
			LedgerJigId,
			remark,
		} = req.body;
		const { badgeId } = req.decoded.user;

		let fileName = undefined;

		if (req?.file?.filename) {
			fileName = req.file.filename;
		}

		const ledgerDetail = await models.LedgerJigDetail.findByPk(id);

		await models.LedgerJigDetailHistory.create(
			{
				regNo: ledgerDetail.regNo,
				approveBy: ledgerDetail.approveBy,
				checkedBy: ledgerDetail.checkedBy,
				makeBy: ledgerDetail.makeBy,
				registrationDate: ledgerDetail.registrationDate,
				machineUse: ledgerDetail.machineUse,
				partNo: ledgerDetail.partNo,
				partName: ledgerDetail.partName,
				acquiredDate: ledgerDetail.acquiredDate,
				location: ledgerDetail.location,
				fileName: ledgerDetail.fileName,
				remark: remark,
				createdBy: badgeId,
				updatedBy: badgeId,
				LedgerJigDetailId: ledgerDetail.id,
			},
			{ transaction },
		);

		const response = await models.LedgerJigDetail.update(
			{
				regNo,
				approveBy,
				checkedBy,
				makeBy,
				registrationDate,
				machineUse,
				partNo,
				partName,
				acquiredDate,
				location,
				fileName,
				createdBy: badgeId,
				updatedBy: badgeId,
				LedgerJigId: LedgerJigId,
			},
			{ where: { id }, transaction },
		);

		transaction.commit();

		return res.status(200).json({
			message: "Success Update Jig Detail!",
			data: response,
		});
	} catch (err) {
		transaction.rollback();
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

export const updateLedgerJig = async (req, res) => {
	const transaction = await connectionDatabase.transaction();
	try {
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

		const { id, name, maker, location, qty, remark, status } = req.body;
		const { badgeId } = req.decoded.user;

		const response = await models.LedgerJig.update(
			{
				name: name,
				maker: maker,
				location: location,
				qty: qty,
				remark: remark,
				status: status,
				updatedBy: badgeId,
			},
			{ where: { id: id }, transaction },
		);

		return res.status(200).json({
			message: "Success Update Ledger Jig!",
			data: response,
		});
	} catch (err) {
		await transaction.rollback();
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

export const importOldJig = async (req, res) => {
	const directoryPath =
		"D:/40703191/Programming/NodeJS/Personal/Ionic/e-work-request/e-work-request-backend/public/ledgers/old";
	XLSX.set_fs(fs);

	const filePath = path.join(directoryPath, "Jig Registration LIST.xlsx");
	const file = XLSX.readFile(filePath, { cellDates: true });
	const sheets = file.SheetNames;

	const errorData = [];

	for (const sheet of sheets) {
		if (
			sheet.toUpperCase().includes("PAGE") ||
			sheet.toUpperCase().includes("TIDAK PAKAI") ||
			sheet.toUpperCase().includes("SHEET")
		) {
			continue;
		}

		const rows = XLSX.utils.sheet_to_json(file.Sheets[sheet]);
		for (const cols of rows) {
			let {
				__EMPTY: name = "",
				__EMPTY_1: registrationNo = "",
				__EMPTY_2: maker = "",
				__EMPTY_3: location = "",
				__EMPTY_4: qty = 0,
				__EMPTY_5: remark = "",
			} = cols;

			const status =
				remark.toUpperCase().includes("SUPERSEDED") ||
				remark.toUpperCase().includes("SPSD")
					? "Superseded"
					: "Operation";

			if (
				registrationNo.trim() === "REG. NO" ||
				registrationNo.trim() === ""
			) {
				continue;
			}

			if (!registrationNo.includes("-")) {
				if (registrationNo.trim().includes(" ")) {
					registrationNo = registrationNo.trim().split(" ").join("-");
				} else {
					registrationNo = `JY-${registrationNo.toUpperCase().split("JY")[1]}`;
				}
			} else if (registrationNo.split("-")[1].length === 1) {
				registrationNo = `JY-${registrationNo.toUpperCase().split("JY")[1]}-${registrationNo.toUpperCase().split("JY")[2]}`;
			}

			const sequence = parseInt(registrationNo.split("-")[1]);

			if (registrationNo.split("-").length > 2) {
				errorData.push({
					sheet,
					name,
					registrationNo,
					sequence,
					maker,
					location,
					qty: parseInt(qty),
					remark,
				});
				continue;
			}

			try {
				await models.LedgerJig.create(
					{
						regNo: registrationNo.toUpperCase().trim(),
						sequence: sequence,
						name: name.trim(),
						maker: maker.trim(),
						location: location.trim(),
						qty: parseInt(qty),
						remark: remark.trim(),
						status: status,
						createdBy: "SYSTEM",
						updatedBy: "SYSTEM",
					},
					{ logging: false },
				);
			} catch (err) {
				if (err.toString().includes("Data too long for column")) {
					console.log({
						sheet,
						name,
						registrationNo,
						maker,
						location,
						qty: parseInt(qty),
						remark,
					});
				}
				errorData.push({
					sheet,
					name,
					registrationNo,
					maker,
					location,
					qty: parseInt(qty),
					remark,
				});
				errorLogging(err.toString());
			}
		}
	}

	await saveDataToCSV(errorData);

	return res.status(200).send("Ok");
};

const saveDataToCSV = async (data) => {
	const csvHeader = "Sheet,Name,Registration No,Maker,Location,Qty,Remark\n";
	const csvRows = data
		.map(
			(item) =>
				`${item.sheet},"${item.name}","${item.registrationNo}","${item.maker}","${item.location}",${item.qty},"${item.remark}"`,
		)
		.join("\n");

	const csvContent = csvHeader + csvRows;

	const filePath = path.join(
		"D:/40703191/Programming/NodeJS/Personal/Ionic/e-work-request/e-work-request-backend/logs/errors/error-data",
		"errorData.csv",
	);
	const directoryToCreate = path.dirname(filePath);

	try {
		await mkdir(directoryToCreate, { recursive: true });
		await writeFile(filePath, csvContent);

		console.log("CSV file saved successfully.");
	} catch (error) {
		console.error("Error saving CSV file:", error);
	}
};
