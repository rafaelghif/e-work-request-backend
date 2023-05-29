import { body } from "express-validator";

export const updateTicketRule = [
    body("id").notEmpty().withMessage("id Cannot Be Null!")
        .isUUID("4").withMessage("Invalid Id"),
    body("location").notEmpty().withMessage("Location Cannot Be Null!"),
    body("description").notEmpty().withMessage("Description Cannot Be Null!"),
    body("remark").notEmpty().withMessage("Remark Cannot Be Null!"),
    body("receivedDate").notEmpty().withMessage("Received Date Cannot Be Null!"),
    body("completedDate").notEmpty().withMessage("Complete Date Cannot Be Null!")
];