import { param } from "express-validator";

export const getChartBackLogsRule = [
	param("year").notEmpty().withMessage("Year Cannot Be Null!"),
	param("month").notEmpty().withMessage("Month Cannot Be Null!"),
];

export const getBacklogsRule = [
	param("year").notEmpty().withMessage("Year Cannot Be Null!"),
	param("month").notEmpty().withMessage("Month Cannot Be Null!"),
	param("registrationNumberId")
		.notEmpty()
		.withMessage("RegistrationNumberId Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid RegistrationNumberId"),
];

export const getChartOutstandingRule = [
	param("year").notEmpty().withMessage("Year Cannot Be Null!"),
	param("month").notEmpty().withMessage("Month Cannot Be Null!"),
];

export const getOutstandingRule = [
	param("year").notEmpty().withMessage("Year Cannot Be Null!"),
	param("month").notEmpty().withMessage("Month Cannot Be Null!"),
	param("registrationNumberId")
		.notEmpty()
		.withMessage("RegistrationNumberId Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid RegistrationNumberId"),
];

export const getChartDueDateRule = [
	param("year").notEmpty().withMessage("Year Cannot Be Null!"),
	param("month").notEmpty().withMessage("Month Cannot Be Null!"),
];

export const getDueDatesRule = [
	param("dueDate").notEmpty().withMessage("Due Date Cannot Be Null!"),
];
