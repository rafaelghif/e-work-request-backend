import { body, param } from "express-validator";

export const createRegistrationNumberRule = [
    body("name").not().isEmpty().withMessage("Department Name Cannot Be Null!"),
    body("format").not().isEmpty().withMessage("Format Cannot Be Null!"),
    body("year").not().isEmpty().withMessage("Year Cannot Be Null!").toInt(),
];

export const updateRegistrationNumberRule = [
    body("id").not().isEmpty().withMessage("RegistrationNumberId Name Cannot Be Null!")
        .isUUID("4").withMessage("Invalid RegistrationNumberId"),
    body("name").not().isEmpty().withMessage("Department Name Cannot Be Null!"),
    body("format").not().isEmpty().withMessage("Format Cannot Be Null!"),
    body("year").not().isEmpty().withMessage("Year Cannot Be Null!").toInt(),
    body("lastNumber").not().isEmpty().withMessage("Last Cannot Be Null!")
        .toInt(),
];

export const inActiveRegistrationNumberRule = [
    param("registrationNumberId").not().isEmpty().withMessage("RegistrationNumberId Name Cannot Be Null!")
        .isUUID("4").withMessage("Invalid RegistrationNumberId"),
];