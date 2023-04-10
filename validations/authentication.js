import { body } from "express-validator";

export const authenticationRule = [
    body("badgeId").not().isEmpty().withMessage("BadgeId Cannot Be Null!")
        .isLength({ min: 8, max: 8 }).withMessage("Invalid Badge Id!"),
    body("password").not().isEmpty().withMessage("Password Cannot Be Null!")
];