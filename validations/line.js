import { body, param } from "express-validator";

export const createLineRule = [
    body("name").not().isEmpty().withMessage("Line Name Cannot Be Null!"),
    body("DepartmentId").not().isEmpty().withMessage("DepartmentId Cannot Be Null!")
        .isUUID("4").withMessage("Invalid DepartmentId")
];

export const getActiveLineByDepartmentRule = [
    param("departmentId").not().isEmpty().withMessage("DepartmentId Cannot Be Null!")
        .isUUID("4").withMessage("Invalid LineId"),
]

export const updateLineRule = [
    body("id").not().isEmpty().withMessage("LineId Cannot Be Null!")
        .isUUID("4").withMessage("Invalid LineId"),
    body("name").not().isEmpty().withMessage("Line Name Cannot Be Null!"),
    body("DepartmentId").not().isEmpty().withMessage("DepartmentId Cannot Be Null!")
        .isUUID("4").withMessage("Invalid DepartmentId")
];

export const inActiveLineRule = [
    param("lineId").not().isEmpty().withMessage("LineId Cannot Be Null!")
        .isUUID("4").withMessage("Invalid LineId"),
];