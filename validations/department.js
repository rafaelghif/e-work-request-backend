import { body, param } from "express-validator";

export const createDepartmentRule = [
    body("name").not().isEmpty().withMessage("Department Name Cannot Be Null!"),
    body("abbreviation").not().isEmpty().withMessage("Department Abbreviation Cannot Be Null!")
];

export const updateDepartmentRule = [
    body("id").not().isEmpty().withMessage("DepartmentId Cannot Be Null!")
        .isUUID("4").withMessage("Invalid DepartmentId"),
    body("name").not().isEmpty().withMessage("Department Name Cannot Be Null!"),
    body("abbreviation").not().isEmpty().withMessage("Department Abbreviation Cannot Be Null!")
];

export const inActiveDepartmentRule = [
    param("departmentId").not().isEmpty().withMessage("DepartmentId Cannot Be Null!")
        .isUUID("4").withMessage("Invalid Department Id")
];