import { body, param } from "express-validator";

export const createUserRule = [
    body("badgeId").not().isEmpty().withMessage("BadgeId Cannot Be Null!"),
    body("password").not().isEmpty().withMessage("Password Cannot Be Null!"),
    body("name").not().isEmpty().withMessage("Name Cannot Be Null!"),
    body("role").not().isEmpty().withMessage("Role Cannot Be Null!"),
    body("DepartmentId").not().isEmpty().withMessage("DepartmentId Cannot Be Null!")
        .isUUID("4").withMessage("Invalid DepartmentId"),
    body("SectionId").not().isEmpty().withMessage("SectionId Cannot Be Null!")
        .isUUID("4").withMessage("Invalid SectionId"),
];

export const updateUserRule = [
    body("id").not().isEmpty().withMessage("UserId Cannot Be Null!")
        .isUUID("4").withMessage("Invalid DepartmentId"),
    body("badgeId").not().isEmpty().withMessage("BadgeId Cannot Be Null!"),
    body("password").not().isEmpty().withMessage("Password Cannot Be Null!"),
    body("name").not().isEmpty().withMessage("Name Cannot Be Null!"),
    body("role").not().isEmpty().withMessage("Role Cannot Be Null!"),
    body("DepartmentId").not().isEmpty().withMessage("DepartmentId Cannot Be Null!")
        .isUUID("4").withMessage("Invalid DepartmentId"),
    body("SectionId").not().isEmpty().withMessage("SectionId Cannot Be Null!")
        .isUUID("4").withMessage("Invalid SectionId"),
];

export const inActiveUserRule = [
    param("userId").not().isEmpty().withMessage("UserId Cannot Be Null!")
        .isUUID("4").withMessage("Invalid DepartmentId")
];