import { body, param } from "express-validator";

export const createDepartmentRule = [
    body("name").notEmpty().withMessage("Department Name Cannot Be Null!"),
    body("abbreviation").notEmpty().withMessage("Department Abbreviation Cannot Be Null!")
];

export const updateDepartmentRule = [
    body("id").notEmpty().withMessage("DepartmentId Cannot Be Null!")
        .isUUID("4").withMessage("Invalid DepartmentId"),
    body("name").notEmpty().withMessage("Department Name Cannot Be Null!"),
    body("abbreviation").notEmpty().withMessage("Department Abbreviation Cannot Be Null!")
];

export const inActiveDepartmentRule = [
    param("departmentId").notEmpty().withMessage("DepartmentId Cannot Be Null!")
        .isUUID("4").withMessage("Invalid Department Id")
];

export const getTicketAssigneeDepartmentRule = [
    param("ticketId").notEmpty().withMessage("DepartmentId Cannot Be Null!")
        .isUUID("4").withMessage("Invalid Department Id")
];