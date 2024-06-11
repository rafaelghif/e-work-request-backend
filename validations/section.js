import { body, param } from "express-validator";

export const getSectionByDepartmentRule = [
	param("departmentId")
		.notEmpty()
		.withMessage("DepartmentId Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid DepartmentId"),
];

export const getActiveSectionByDepartmentRule = [
	param("departmentId")
		.notEmpty()
		.withMessage("DepartmentId Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid DepartmentId"),
];

export const createSectionRule = [
	body("name").notEmpty().withMessage("Department Name Cannot Be Null!"),
	body("level")
		.notEmpty()
		.withMessage("Department Name Cannot Be Null!")
		.isFloat()
		.isFloat()
		.withMessage("Invalid Level")
		.toFloat(),
	body("departmentId")
		.notEmpty()
		.withMessage("DepartmentId Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid DepartmentId"),
];

export const updateSectionRule = [
	body("id")
		.notEmpty()
		.withMessage("SectionId Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid SectionId"),
	body("name").notEmpty().withMessage("Department Name Cannot Be Null!"),
	body("level")
		.notEmpty()
		.withMessage("Department Name Cannot Be Null!")
		.isFloat()
		.isFloat()
		.withMessage("Invalid Level")
		.toFloat(),
	body("DepartmentId")
		.notEmpty()
		.withMessage("DepartmentId Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid DepartmentId"),
];

export const inActiveSectionRule = [
	param("sectionId")
		.notEmpty()
		.withMessage("SectionId Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid DepartmentId"),
];
