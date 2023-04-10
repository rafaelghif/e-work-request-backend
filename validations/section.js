import { body, param } from "express-validator";

export const getSectionByDepartmentRule = [
    param("departmentId").not().isEmpty().withMessage("DepartmentId Cannot Be Null!")
        .isUUID("4").withMessage("Invalid DepartmentId")
];

export const getActiveSectionByDepartmentRule = [
    param("departmentId").not().isEmpty().withMessage("DepartmentId Cannot Be Null!")
        .isUUID("4").withMessage("Invalid DepartmentId")
];

export const createSectionRule = [
    body("name").not().isEmpty().withMessage("Department Name Cannot Be Null!"),
    body("level").not().isEmpty().withMessage("Department Name Cannot Be Null!")
        .isFloat().isFloat().withMessage("Invalid Level")
        .toFloat(),
    body("departmentId").not().isEmpty().withMessage("DepartmentId Cannot Be Null!")
        .isUUID("4").withMessage("Invalid DepartmentId")
];

export const updateSectionRule = [
    body("id").not().isEmpty().withMessage("SectionId Cannot Be Null!")
        .isUUID("4").withMessage("Invalid SectionId"),
    body("name").not().isEmpty().withMessage("Department Name Cannot Be Null!"),
    body("level").not().isEmpty().withMessage("Department Name Cannot Be Null!")
        .isFloat().isFloat().withMessage("Invalid Level")
        .toFloat(),
    body("DepartmentId").not().isEmpty().withMessage("DepartmentId Cannot Be Null!")
        .isUUID("4").withMessage("Invalid DepartmentId")
];

export const inActiveSectionRule = [
    param("sectionId").not().isEmpty().withMessage("SectionId Cannot Be Null!")
        .isUUID("4").withMessage("Invalid DepartmentId")
];