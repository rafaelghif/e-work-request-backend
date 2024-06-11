import { body, param } from "express-validator";

export const createLineRule = [
	body("name").notEmpty().withMessage("Line Name Cannot Be Null!"),
	body("DepartmentId")
		.notEmpty()
		.withMessage("DepartmentId Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid DepartmentId"),
];

export const getActiveLineByDepartmentRule = [
	param("departmentId")
		.notEmpty()
		.withMessage("DepartmentId Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid LineId"),
];

export const updateLineRule = [
	body("id")
		.notEmpty()
		.withMessage("LineId Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid LineId"),
	body("name").notEmpty().withMessage("Line Name Cannot Be Null!"),
	body("DepartmentId")
		.notEmpty()
		.withMessage("DepartmentId Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid DepartmentId"),
];

export const inActiveLineRule = [
	param("lineId")
		.notEmpty()
		.withMessage("LineId Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid LineId"),
];
