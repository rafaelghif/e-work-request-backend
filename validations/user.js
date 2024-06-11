import { body, param } from "express-validator";

export const createUserRule = [
	body("badgeId").notEmpty().withMessage("BadgeId Cannot Be Null!"),
	body("password").notEmpty().withMessage("Password Cannot Be Null!"),
	body("name").notEmpty().withMessage("Name Cannot Be Null!"),
	body("role").notEmpty().withMessage("Role Cannot Be Null!"),
	body("DepartmentId")
		.notEmpty()
		.withMessage("DepartmentId Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid DepartmentId"),
	body("SectionId")
		.notEmpty()
		.withMessage("SectionId Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid SectionId"),
];

export const updateUserRule = [
	body("id")
		.notEmpty()
		.withMessage("UserId Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid DepartmentId"),
	body("badgeId").notEmpty().withMessage("BadgeId Cannot Be Null!"),
	body("password").notEmpty().withMessage("Password Cannot Be Null!"),
	body("name").notEmpty().withMessage("Name Cannot Be Null!"),
	body("role").notEmpty().withMessage("Role Cannot Be Null!"),
	body("DepartmentId")
		.notEmpty()
		.withMessage("DepartmentId Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid DepartmentId"),
	body("SectionId")
		.notEmpty()
		.withMessage("SectionId Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid SectionId"),
];

export const inActiveUserRule = [
	param("userId")
		.notEmpty()
		.withMessage("UserId Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid DepartmentId"),
];
