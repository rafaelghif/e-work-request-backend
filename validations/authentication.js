import { body } from "express-validator";

export const authenticationRule = [
    body("badgeId").notEmpty().withMessage("BadgeId Cannot Be Null!")
        .isLength({ min: 8, max: 8 }).withMessage("Invalid Badge Id!"),
    body("password").notEmpty().withMessage("Password Cannot Be Null!")
];