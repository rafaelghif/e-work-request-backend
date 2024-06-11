import { body, param } from "express-validator";

export const createRegistrationNumberRule = [
	body("name").notEmpty().withMessage("Department Name Cannot Be Null!"),
	body("format").notEmpty().withMessage("Format Cannot Be Null!"),
	body("year").notEmpty().withMessage("Year Cannot Be Null!").toInt(),
];

export const updateRegistrationNumberRule = [
	body("id")
		.notEmpty()
		.withMessage("RegistrationNumberId Name Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid RegistrationNumberId"),
	body("name").notEmpty().withMessage("Department Name Cannot Be Null!"),
	body("format").notEmpty().withMessage("Format Cannot Be Null!"),
	body("year").notEmpty().withMessage("Year Cannot Be Null!").toInt(),
	body("lastNumber").notEmpty().withMessage("Last Cannot Be Null!").toInt(),
];

export const inActiveRegistrationNumberRule = [
	param("registrationNumberId")
		.notEmpty()
		.withMessage("RegistrationNumberId Name Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid RegistrationNumberId"),
];
